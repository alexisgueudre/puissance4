$('#game').ready(function () {
    const p4 = new game('#game');
    $('#restart').on('click',function () {
        $('#game').empty();
        p4.drawGame();
        $('#restart').css('visibility','hidden');
        let score = p4.Scores();
        $("#playerone").text("players one : "+score.red);
        $("#playertwo").text("players two : "+score.yellow)
    })
});

