import React, { useState } from 'react'
import { Chess, ChessInstance } from 'chess.js'
import Popup from 'reactjs-popup'
import useChessStore from '../ts/state/chessStore'
import { pokeAction, offerDrawPoke, revokeDrawPoke, declineDrawPoke, acceptDrawPoke, claimSpecialDrawPoke, resignPoke, requestUndoPoke, revokeUndoPoke, declineUndoPoke, acceptUndoPoke } from '../ts/helpers/urbitChess'
import { CHESS } from '../ts/constants/chess'
import { Ship, Side, GameID, SAN, GameInfo, ActiveGameInfo } from '../ts/types/urbitChess'

export function GamePanel () {
  const { urbit, displayGame, setDisplayGame, practiceBoard, setPracticeBoard, displayIndex, setDisplayIndex } = useChessStore()
  const hasActiveGame: boolean = !(displayGame.archived)
  const practiceHasMoved: boolean = (localStorage.getItem('practiceBoard') !== CHESS.defaultFEN)
  const opponent: Ship = (urbit.ship === displayGame.white.substring(1))
    ? displayGame.black
    : displayGame.white
  const canUndo: boolean = (displayGame.moves.length >= 2)
    ? true
    : (urbit.ship === displayGame.white.substring(1) && displayGame.moves.length >= 1)

  //
  // HTML element helper functions
  //

  const resignOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, resignPoke(gameID))
  }

  const offerDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, offerDrawPoke(gameID))
  }

  const acceptDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, acceptDrawPoke(gameID))
  }

  const declineDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, declineDrawPoke(gameID))
  }

  const revokeDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, revokeDrawPoke(gameID))
  }

  const claimSpecialDrawOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, claimSpecialDrawPoke(gameID))
  }

  const requestUndoOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, requestUndoPoke(gameID))
  }

  const acceptUndoOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, acceptUndoPoke(gameID))
  }

  const declineUndoOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, declineUndoPoke(gameID))
  }

  const revokeUndoOnClick = async () => {
    const gameID = displayGame.gameID
    await pokeAction(urbit, revokeUndoPoke(gameID))
  }

  const moveOpacity = (index: number) => {
    if (index <= displayIndex) {
      return 1.0
    } else {
      return 0.3
    }
  }

  //
  // HTML element generation functions
  //

  const moveList = () => {
    let displayMoves = (displayGame.moves !== null) ? displayGame.moves : []
    let components = []
    for (let wIndex: number = 0; wIndex < displayMoves.length; wIndex += 2) {
      const move: number = (wIndex / 2) + 1
      const bIndex: number = wIndex + 1
      const wMove: SAN = displayMoves[wIndex].san

      if (bIndex >= displayMoves.length) {
        components.push(
          <li key={ move } className='move-item' style={{ opacity: moveOpacity(wIndex) }}>
            <span onClick={ () => setDisplayIndex(wIndex) }>
              { wMove }
            </span>
          </li>
        )
      } else {
        components.push(
          <li key={ move } className='move-item' style={{ opacity: moveOpacity(wIndex) }}>
            <span onClick={ () => setDisplayIndex(wIndex) }>
              { wMove }
            </span>
            { '\xa0'.repeat(6 - wMove.length) }
            {/* setting opacity to 1.0 offsets a cumulative reduction in opacity on each bIndex ply when displayIndex < this move's wIndex */}
            <span onClick={ () => setDisplayIndex(bIndex) } style={{ opacity: (moveOpacity(wIndex) === 1.0) ? moveOpacity(bIndex) : 1.0 }}>
              { displayMoves[wIndex + 1].san }
            </span>
          </li>
        )
      }
    }

    return components
  }

  //
  // Render HTML
  //

  const renderDrawPopup = (game: ActiveGameInfo) => {
    return (
      <Popup open={game.gotDrawOffer}>
        <div>
          <p>{`${opponent} has offered a draw`}</p>
          <br/>
          <div className='draw-resolution row'>
            <button className="accept" role="button" onClick={acceptDrawOnClick}>Accept</button>
            <button className="reject" role="button" onClick={declineDrawOnClick}>Decline</button>
          </div>
        </div>
      </Popup>
    )
  }

  const renderUndoPopup = (game: ActiveGameInfo) => {
    return (
      <Popup open={game.gotUndoRequest}>
        <div>
          <p>{`${opponent} has requested to undo a move`}</p>
          <br/>
          <div className='draw-resolution row'>
            <button className="accept" role="button" onClick={acceptUndoOnClick}>Accept</button>
            <button className="reject" role="button" onClick={declineUndoOnClick}>Decline</button>
          </div>
        </div>
      </Popup>
    )
  }

  return (
    <div className='game-panel-container col' style={{ display: ((displayGame !== null) ? 'flex' : ' none') }}>
      <div className="game-panel col">
        <div id="opp-timer" className={'timer row'}>
          <p>00:00</p>
        </div>
        <div id="opp-player" className={'player row'}>
          <p>{opponent}</p>
        </div>
        <div className={'moves col'}>
          <ol>
            { moveList() }
          </ol>
        </div>
        <div id="our-player" className={'player row'}>
          <p>~{window.ship}</p>
        </div>
        <div id="our-timer" className={'timer row'}>
          <p>00:00</p>
        </div>
        {/* buttons */}
        {/* resign button */}
        <button
          className='option'
          disabled={!hasActiveGame}
          onClick={resignOnClick}>
          Resign</button>
        {/* offer/revoke/accept draw button */}
        {(!hasActiveGame || (!(displayGame as ActiveGameInfo).gotDrawOffer && !(displayGame as ActiveGameInfo).sentDrawOffer))
          ? <button
            className='option'
            disabled={!hasActiveGame}
            onClick={offerDrawOnClick}>
            Send Draw Offer</button>
          : ((displayGame as ActiveGameInfo).gotDrawOffer
            ? <button
              className='option'
              onClick={acceptDrawOnClick}>
              Accept Draw Offer</button> // accept
            : <button
              className='option'
              onClick={revokeDrawOnClick}>
              Revoke Draw Offer</button> // revoke
          )
        }
        {/* claim special draw */}
        <button
          className='option'
          disabled={!hasActiveGame || !(displayGame as ActiveGameInfo).drawClaimAvailable}
          onClick={claimSpecialDrawOnClick}>
          Claim Special Draw</button>
        {/* request/revoke/accept undo button */}
        {(!hasActiveGame || (!(displayGame as ActiveGameInfo).gotUndoRequest && !(displayGame as ActiveGameInfo).sentUndoRequest))
          ? <button
            className='option'
            disabled={!hasActiveGame || !canUndo}
            onClick={requestUndoOnClick}>
            Request to Undo Move</button>
          : ((displayGame as ActiveGameInfo).gotUndoRequest)
            ? <button
              className='option'
              onClick={acceptUndoOnClick}>
              Accept Undo Request</button>
            : <button
              className='option'
              onClick={revokeUndoOnClick}>
              Revoke Undo Request</button>
        }
        {/* practice board */}
        <button
          className='option'
          onClick={() => setDisplayGame(null)}>
          Practice Board</button>
      </div>
      { hasActiveGame ? renderDrawPopup((displayGame as ActiveGameInfo)) : <div/> }
      { hasActiveGame ? renderUndoPopup((displayGame as ActiveGameInfo)) : <div/> }
    </div>
  )
}
