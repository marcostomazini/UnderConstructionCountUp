$(function(){
    setInterval(function(){
        refreshPage()
    }, 300000);

    getTrelloData(function(data){
        var chartData = [];

        var idDone = getDoneIdList(data.lists);

        chartData = calculateDonePoints(getCardsFromList(data.cards, idDone), data.members);
        chartData = dataBeautifier(chartData);

        addChart(chartData);  // Chama gráfico
    }); 
});

var dataBeautifier = function(data){
    retorno = data;
    retorno.forEach(function(member){
        if (member.y !== 0){
            member.dataLabels.enabled = true;

            switch (member.name){
                case "André Moraes":
                    member.name = "André";
                    break;
                case "Cléber Ferreira":
                    member.name = "Cléber";
                    break;
                case "Edoil R. de Barros":
                    member.name = "Edoil";
                    break;
                case "Elisiani Angelim":
                    member.name = "Elisiani";
                    break;
                case "Gabriel Capoia":
                    member.name = "Capoia";
                    break;
                case "HEIDER DE FIGUEREDO":
                    member.name = "Heider";
                    break;
                case "Luciane Baldo Nicolodi":
                    member.name = "Luciane";
                    break;
                case "Luis Gustavo Uzai":
                    member.name = "Uzai";
                    break;
                case "Marco Diniz":
                    member.name = "Marco";
                    break;
                case "Mary Provinciatto":
                    member.name = "Mary";
                    break;
                case "Regis Ranniere":
                    member.name = "Ranniere";
                    break;
                case "Ricardo Aleixo":
                    member.name = "Ricardo";
                    break;
                case "Rodrigo F. Fernandes":
                    member.name = "Rodrigo";
                    break;
                case "Wilde":
                    member.name = "Wilde";
                    break;
                case "marcos tomazini":
                    member.name = "Tomazini";
                    break;                
            }

            member.name += ": " + member.y;
        }
    });

    return retorno;
};

var calculateDonePoints = function(cards, members){
    var retorno = membersInitialize(members);
    cards.forEach(function(card){
        if (card.labels.containsName(config.sysConfig.nome_label_burndown_aam) || card.labels.containsName(config.sysConfig.nome_label_burndown_imp)){
            retorno.forEach(function(member){
                if (member.id === card.idMembers[0]){
                    member.y += card.name.getPoints();
                }
            });
        }
    });

    return retorno;
};

var membersInitialize = function(members){
    var retorno = [];
    members.forEach(function(member){
        retorno.push({
            id: member.id,
            name: member.fullName,
            y: 0.0,
            dataLabels: {
                enabled: false,
            }
        });
    });
    return retorno;
};

var refreshPage = function(){
    window.location.reload(true);
};

var getDoneIdList = function(lists){
    retorno = null;

    lists.forEach(function(list){
        if (list.name === config.sysConfig.nome_lista_done){
            retorno = list.id;
            return retorno;
        }
    });

    return retorno;
}

var getCardsFromList = function(burndownCards, idList){
    retorno = [];

    burndownCards.forEach(function(card){
        if (card.idList === idList){
            retorno.push(card);
        }
    });
    return retorno;
};



String.prototype.getPoints = function(){
    return parseFloat(this.split('(')[1].split(')')[0]);
};

Array.prototype.containsName = function(name){
    var retorno = false;
    this.forEach(function(elem){
        if (elem.name === name){
            retorno = true;
            return retorno;
        }
    });
    return retorno;
};


var getTrelloData = function(callback){    
    $.ajax({
        method: 'GET'
        ,url: getUrlTrelloApi()
    }).done(function(data){
        callback(data);
    });
};

var getUrlTrelloApi = function(){
    var board_id = config.sprintConfig.url_trello.split('/')[4];
    var urlString = "https://api.trello.com/1/board/"+ board_id +"?key="+ config.sysConfig.key_trello +"&cards=visible&lists=open&members=all&member_fields=fullName&token=" + config.sysConfig.token_trello
    return urlString;
};

var changeCssProperty = function(selector, propertyName, propertyValue){
    $(selector).css(propertyName, propertyValue);
};

var addChart = function(data){
    $('#grafico-pontos-full').highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 0,
            plotShadow: false,
        },
        title: {
            text: 'Pontos<br>Finalizados',
            align: 'center',
            verticalAlign: 'middle',
            y: 100
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                dataLabels: {
                    enabled: true,
                    distance: -50,
                    style: {
                        fontWeight: 'bold',
                        color: 'white',
                        textShadow: '0px 1px 2px black',
                        "font-size": "20px"
                    }
                },
                startAngle: -90,
                endAngle: 90,
                center: ['50%', '75%'],
                size: '950px'
            }
        },
        series: [{
            type: 'pie',
            name: 'Pontos Finalizados',
            innerSize: '50%',
            data: data
        }]
    });
};