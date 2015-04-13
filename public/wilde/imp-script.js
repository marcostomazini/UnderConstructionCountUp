$(function(){
    setInterval(function(){
        refreshPage()
    }, 300000);

    getTrelloData(function(data){
        var chartData = {            
            workDays: []
            ,planned: {
                name: 'Previsto',
                data: []
            }
            ,realized: {
                name: 'Realizado',
                data: []
            }
            ,yAxisName: config.sysConfig.nome_eixo_y            
        };

        

        var burndownCards = getBurndownCards(data.cards, config.sysConfig.nome_label_burndown_imp); 

        var somaPontos = getPointsSum(burndownCards);

        var workingDays = getWorkDays();

        workingDays.forEach(function(day){
            chartData.workDays.push(day.toSimpleString());
        });

        chartData.planned.data = calculatePlannedPoints(somaPontos, workingDays.length);

        var idDone = getDoneIdList(data.lists);

        var doneCards = getCardsFromList(burndownCards, idDone);

        chartData.realized.data = calculateRealizedPoints(somaPontos, workingDays, doneCards);

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

var getPointsSum = function(cards){

    var soma = 0.0;
    var buffer;
    for (var i = 0; i < cards.length; i++){
        buffer = cards[i].name.getPoints();
        if (buffer !== NaN){
            soma += buffer;
        }
    }
    return soma;
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

var calculateRealizedPoints = function(points, days, doneCards){
    var retorno = [];
    var remainingPoints = points;
    var dayPoints;
    var buffer;

    for (var i = 0 ; i < doneCards.length ; i++){
        if (new Date(doneCards[i].due) < days[0]){            
            doneCards[i].due = days[0]; // Movimenta para o primeiro dia            
        }        
    }

   

    for (var i = 0 ; i < days.length ; i++){
        if (days[i].equals(nextDayInArray(days))){
            break;
        }
        dayPoints = 0.0;
        doneCards.forEach(function(card){
            if (days[i].equals(getTargetDay(new Date(card.due), days))){
                dayPoints += card.name.getPoints();
            }
        });
        remainingPoints -= dayPoints;
        buffer = parseFloat(remainingPoints.toFixed(2));
        retorno.push(buffer);
    } 

    return retorno;

};

var getTargetDay = function(targetDay, days){    
    var retorno;

    for (var i = 0 ; i < days.length ; i++){
        if (days[i].equals(targetDay)){
            retorno = days[i];
            return retorno;
        }
    }
    return getTargetDay(targetDay.yesterday(), days);
};


var nextDayInArray = function(days){
    for (var i = 0; i < days.length ; i++){
        if (days[i].equals(new Date())){
            if (days[i + 1] !== undefined){
                return days[i + 1];
            } else {
                return new Date();
            }
        }
    }
    return new Date();
}

var getBurndownCards = function(allCards, label_burn){
    retorno = [];

    allCards.forEach(function(card){
        if (card.labels.containsName(label_burn)){
            retorno.push(card);
        }
    });


    return retorno;
};

var calculatePlannedPoints = function(points, days){
    var retorno = [];
    var pointsDecrementer = points;
    var decrementFactor = points / (days - 1);
    for (var dayCount = days ; dayCount > 0 ; dayCount--){
        retorno.push(parseFloat(pointsDecrementer.toFixed(2)));
        pointsDecrementer -= decrementFactor;
    }    

    return retorno;
}

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

Date.prototype.equals = function(date){
    if (this.getDate() === date.getDate() && this.getMonth() === date.getMonth() && this.getFullYear() == date.getFullYear()){
        return true;
    }
    return false;
};

Date.prototype.toSimpleString = function(){
    var returnString = '';
    if (this.getDate() < 10)
        returnString += '0';
    returnString += this.getDate() + '/';
    var monthName = '';
    switch(this.getMonth()){
        case 0:
            monthName = 'Jan';
            break;
        case 1:
            monthName = 'Fev';
            break;
        case 2:
            monthName = 'Mar';
            break;
        case 3:
            monthName = 'Abr';
            break;
        case 4:
            monthName = 'Mai';
            break;
        case 5:
            monthName = 'Jun';
            break;
        case 6:
            monthName = 'Jul';
            break;
        case 7:
            monthName = 'Ago';
            break;
        case 8:
            monthName = 'Set';
            break;
        case 9:
            monthName = 'Out';
            break;
        case 10:
            monthName = 'Nov';
            break;
        case 11:
            monthName = 'Dez';
            break;
    }
    returnString += monthName;
    return returnString;
}

Date.prototype.tomorrow = function(){  // Somar um dia à data do parâmetro
    var nextDay = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    nextDay.setDate(nextDay.getDate() + 1);
    return nextDay;
};

Date.prototype.yesterday = function(){  // Subtrair um dia à data do parâmetro
    var yesterday = new Date(this.getFullYear(), this.getMonth(), this.getDate());
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday;
};

var stringToDate = function(date){ // Parâmetro no formato DD/MM/YYYY
    var buffer = date.split('/');
    return new Date(buffer[2], buffer[1] - 1, buffer[0]);
};



var isWorkDay = function(date, notWorkingDays){  // Verifica se o parâmetro date é um dia com jornada de trabalho
    if (date.getDay() === 0 || date.getDay() === 6){ // Checa Domingo ou Sábado
        return false;
    }

    for (var i = 0; i < notWorkingDays.length; i++){ // Checa dias sem jornada do parâmetro
        if (date.equals(notWorkingDays[i])){
            return false;
        }
    }

    return true;
};

var getWorkDays = function(){
    var workDays = [];
    var notWorkingDays = [];
    config.sprintConfig.dias_sem_jornada.forEach(function(day){
        notWorkingDays.push(stringToDate(day));
    });

    var dayIterator = stringToDate(config.sprintConfig.data_inicial);
    var finalDate = stringToDate(config.sprintConfig.data_final);

    while (dayIterator - finalDate <= 0){
        if (isWorkDay(dayIterator, notWorkingDays)){
            workDays.push(dayIterator);            
        }      
        dayIterator = dayIterator.tomorrow();  
    }
    return workDays;
}


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

var addConfig = function(){
    changeCssProperty('body', 'background-color', '#' + config.sysConfig.cor_de_fundo_da_tela);
	changeCssProperty('#crew-container', 'background-color', '#' + config.sysConfig.cor_de_fundo_do_titulo);
    changeCssProperty('#crew-name', 'color', '#' + config.sysConfig.cor_fonte);
    $('#crew-name').append(config.sysConfig.nome_da_equipe);
    $('#link-trello').attr('href', config.sprintConfig.url_trello);
};

var changeCssProperty = function(selector, propertyName, propertyValue){
	$(selector).css(propertyName, propertyValue);
};

var addChart = function(data){
	$('#burndown').highcharts({
        chart: {
            type: 'line'
        },
        title: {
            text: 'Burndown - IMP'
        },
        subtitle: {
            text: config.sprintConfig.legenda_burndown ? config.sprintConfig.legenda_burndown : ''
        },
        xAxis: {
            categories: data.workDays
        },
        yAxis: {
        	min: 0,
        	minRange: 0.1,
            title: {
                text: data.yAxisName
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                },
                enableMouseTracking: true
            }
        },
        series: [data.realized, data.planned]
    });
};