/-  chess
/+  chess
=,  format
|_  game=chess-game:chess
++  grab
  |%
  ++  noun  chess-game:chess
  --
++  grow
  |%
  ++  noun  game
  ++  json
    %-  pairs:enjs
    :~  ['gameID' [%s (scot %da game-id.game)]]
        ['event' [%s event.game]]
        ['site' [%s site.game]]
        ['round' [%s (round-string:chess round.game)]]
        ['white' [%s (player-string:chess white.game)]]
        ['black' [%s (player-string:chess black.game)]]
        ['archived' [%b %.n]]
        ::  default values. updated thru [%game @ta %updates ~] sub.
        ['moves' [%a ~]]
        ['position' [%s '']]
        ['gotDrawOffer' [%b %.n]]
        ['sentDrawOffer' [%b %.n]]
        ['drawClaimAvailable' [%b %.n]]
        ['autoClaimSpecialDraws' [%b %.n]]
        ['gotUndoRequest' [%b %.n]]
        ['sentUndoRequest' [%b %.n]]
    ==
  --
++  grad  %noun
--
