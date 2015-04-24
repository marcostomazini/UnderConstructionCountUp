var chamaPizzaiolo = function(ingredientes){
	var data = ingredientes.cards.filter(function(ingrediente){
		return ingrediente.name === 'Pizzas Pendentes';
	})[0];

	delete ingredientes;

	var pizzaCount = 0;

	var pizzaData;
	var fatiaData;
	var buffer;

	data.checklists.forEach(function(pizza){
		pizzaCount++;
		pizzaData = {};
		pizzaData.title = pizza.name;
		pizzaData.data = [];
		pizza.checkItems.forEach(function(fatia){
			fatiaData = {};
			buffer = fatia.name.split(':');
			fatiaData.name = buffer[0];
			fatiaData.y = 1;
			fatiaData.color = '#F0F70F';
			buffer.filter(function(buff){
				return buff === 'pizza';
			}).forEach(function(buff){
				pizzaData.data.push(fatiaData);
			});
		});
		pizzaData = normalizatePizzaData(pizzaData);
		$('#pizzas').append('<div id="pizza-section' + pizzaCount + '"></div>');
		inserePizza(pizzaCount, pizzaData);
	});

	
	
    
}

var normalizatePizzaData = function(pizza){
	var pizzaReturn = pizza;

	var tamanhoPizza = pizza.title.split('(')[1].split(' ')[0];

	var fatiasFaltantes = tamanhoPizza - pizza.data.length; // Se pizza.data.length > tamanhoPizza vai dar pau, to nem aí

	for (var count = fatiasFaltantes; count > 0; count--){
		pizzaReturn.data.push({
			name: '?',
			y: 1,
			color: '#000000'
		});
	}
	return pizzaReturn;
}

var inserePizza = function(id, data){
	$('#pizza-section' + id).highcharts({
        chart: {
            plotBackgroundColor: null,
            plotBorderWidth: null,
            plotShadow: false,
            backgroundColor: '#' + config.sysConfig.cor_de_fundo_da_tela
        },
        title: {
            text: data.title
        },
        tooltip: {
            pointFormat: ''
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                    }
                },
                borderColor: '#C97918',
                borderWidth: 8,
                dataLabels: {
	                distance: -60,
	                color: 'white',
	            },
	            size: '350px'
            }
        },
        series: [{
            type: 'pie',
            name: 'Pizza ' + id,
            data: data.data
        }]
    });
};