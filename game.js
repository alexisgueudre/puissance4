class game
{
    constructor(selector)
    {
        this.colones = 6;
        this.lignes = 5;
        this.selector = selector ;
        this.player = 'red';

        this.drawGame();
        this.ecoute();
        this.win();
        this.score = {red : 0 , yellow : 0};
    }

    //affichage du jeu
    drawGame()
    {
        const $jeux = $(this.selector);
        for (let iligne = 0; iligne < this.lignes; iligne++)
        {
            const $ligneGame = $("<div>").addClass('lgn');
            for (let icol = 0; icol < this.colones ; icol++)
            {
                const $colGame = $("<div>").addClass('col empty').attr("data-col", icol).attr("data-ligne",iligne)
                $ligneGame.append($colGame);
            }
            $jeux.append($ligneGame)
        }
    }

    Scores()
    {
        return this.score;
    }
    //cours de la partie

    ecoute()
    {
        const $jeux = $(this.selector);
        const that = this;
        // on ecoute la derniere case de libre
        function Lastcase(col)
        {
            const  $cellules = $(`.col[data-col = '${col}']`)
            for (let i = $cellules.length -1; i>=0; i--)
            {
                const  $cellule = $($cellules[i]);
                if ($cellule.hasClass('empty'))
                {
                    return $cellule;
                }
            }
        }
        $jeux.on('mouseenter','.col.empty',function ()
        {
            const $col = $(this).data('col');
            const $last = Lastcase($col);
            if ($last != null)
            {
                $last.addClass(`p${that.player}`);
            }
        });
        $jeux.on('mouseleave','.col',function ()
        {
          $('.col').removeClass(`p${that.player}`);
        });

        $jeux.on('click','.col.empty',function ()
        {
            const col = $(this).data('col');
            const $last = Lastcase(col);
            $last.addClass(`${that.player}`).removeClass(`empty p${that.player}`).data('player', `${that.player}`);

            const winner = that.win($last.data('ligne'),$last.data('col'));

            //ternaire pour le switch des joueurs
            that.player = (that.player === 'red') ? 'yellow' : 'red';


            if (that.player === 'red')
            {
                $('#player').text("joueur 1")
            }
            if (that.player === "yellow")
            {
                $("#player").text("joueur 2")
            }
            //relance de partie si gagant
            if (winner)
            {
                alert(`les ${winner} ont gagné la partie`)
                $('#restart').css('visibility', "visible");
                (winner === 'red') ? that.score.red++ : that.score.yellow++;
                return ;
            }
            if (winner !== true)
            {
                if($(".empty").length === 0 )
                {
                     alert("match nul");
                    $('#restart').css('visibility', "visible");
                    return ;
                }
            }
        });
    }

    //check si winner et les differente possition des pions
    win(lgn,col)
    {
        const that = this;
        function $getCelulle(i, j)
        {
            return $(`.col[data-ligne = '${i}'][data-col = '${j}']`)
        }


        function checkDirection(arraydirection)
        {
            let total = 0;
            let i = lgn + arraydirection.i;
            let j = col + arraydirection.j ;
            let $next = $getCelulle(i,j);
            while (i >= 0 && i < that.lignes && j >= 0 && j < that.colones  && $next.data('player') === that.player)
            {
                total++;
                i += arraydirection.i;
                j += arraydirection.j;
                $next = $getCelulle(i, j);
            }
            return total;
        }


        function checkGagnant(direction_A,direction_B)
        {
            const total = 1 + checkDirection(direction_A) + checkDirection(direction_B)
            if (total>=4)
            {
                return that.player;
            }

            else
                {
                    return null;
                }
        }

        function checkHorizontal()
        {
            return checkGagnant({i: 0, j: -1},{i: 0, j: 1});
        }
        function checkVertical()
        {
            return checkGagnant({i: -1, j: 0},{i: 1, j: 0});
        }

        function checkDiagonal1()
        {
            return checkGagnant({i: 1, j: 1},{i: -1, j: -1});
        }
        function checkDiagonal2()
        {
            return checkGagnant({i: 1, j: -1},{i: -1, j: 1});
        }

        return checkHorizontal() || checkVertical() || checkDiagonal1() || checkDiagonal2() ;
    }
}