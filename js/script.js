/*
	Logica
	========
	
	Deel 1: Indien klas wijzigt -> laad studenten voor die klas EN laad lege gipvakken voor die klas

	Deel 2: Indien student wijzigt -> Laad de student data EN laad de GIP evaluaties van die student

	Deel 3: Indien op Opslaan geklikt wordt, schrijf gipevaluaties weg bij de juiste student
*/

/* =============================
			Deel 1
============================= */

//Klas is verandered in dropdown -> Lees klas uit en haal data (studenten en gipvakken) op
function class_changed()
{
	let class_dropdown = document.querySelector('.class-select');
	let class_id = class_dropdown.options[class_dropdown.selectedIndex].value;
	if(class_id != 0){
		execute_script('get_class_data', class_id, class_change_followup);
	}
}

//Afhandeling van de veranderde klas
function class_change_followup(data)
{
	//Vul de studenten dropdown op met de leerlingen van die klas
	change_student_dropdown(data.students);

	//Vul de tabel op met de gipvakken van die klas
	print_empty_gip_table(data.gipvakken);

	//Pas de paginatitel aan
	let title = document.querySelector('.title');
	title.innerHTML = 'Selecteer een leerling om te beginnen';

	//Blokkeer de opslaan knop tot een student gekozen is
	let save_button = document.querySelector('.confirm-student');
	save_button.setAttribute("disabled", "disabled");
}

function change_student_dropdown(students)
{
	//Laad studenten van de gekozen klas in de dropdown
	let student_dropdown = document.querySelector(".student-select");
	student_dropdown.innerHTML = "<option value='0'>Maak een keuze</option>";

	students.forEach(function(student) {
		let student_name = student.voornaam+' '+student.naam;
	    let el = document.createElement("option");
	    el.textContent = student_name;
	    el.value = student.id;
	    student_dropdown.appendChild(el);
	});

	//maak de studenten dropdown beschikbaar
	student_dropdown.removeAttribute("disabled");
}

function print_empty_gip_table(gipvakken)
{
	let gip_table = document.querySelector(".gip-table");

	gip_table.innerHTML = ''; //Leegmaken voor begin

	let tabindex_counter = 1;
	gipvakken.forEach(function(gipvak, gipvak_index) {
		let first_tab = gipvak_index + tabindex_counter;
		let second_tab = first_tab + 1;
		//For each gipvak -> build a table row
	    let row = document.createElement("tr");
	    row.setAttribute('data-id', gipvak.gv_id);
	    //header
	    let header = document.createElement("th");
	    header.textContent = gipvak.gv_datum + ' | ' + gipvak.gv_code;
	    //score input
	    let score = document.createElement("td");
	    score.classList.add('is-narrow', 'has-input');
	    let score_field = document.createElement("input");
	    score_field.classList.add('input', 'row-input', 'score');
	    score_field.setAttribute('type', 'text');
		score_field.setAttribute('value', '');
		score_field.setAttribute('disabled', 'disabled');
		score_field.setAttribute('tabindex', first_tab);
	    score.appendChild(score_field);
	    //rating
	    let rating = document.createElement("td");
	    rating.classList.add('rating');
	    //note
	    let note = document.createElement("td");
	    note.classList.add('has-input');
	    let note_field = document.createElement("input");
	    note_field.classList.add('input', 'row-input', 'note');
	    note_field.setAttribute('type', 'text');
		note_field.setAttribute('value', '');
		note_field.setAttribute('disabled', 'disabled');
		note_field.setAttribute('tabindex', second_tab);
	    note.appendChild(note_field);

	    row.appendChild(header);
	    row.appendChild(score);
	    row.appendChild(rating);
	    row.appendChild(note);

	    //add the row to the table
	    gip_table.appendChild(row);
	    tabindex_counter++;
	});
}

/* =============================
			Deel 2
============================= */

//Student is veranderd in dropdown -> Lees student uit en haal data (student en evauaties) op
function student_changed()
{
	let student_dropdown = document.querySelector(".student-select");
	let student_id = student_dropdown.options[student_dropdown.selectedIndex].value;
	if(student_id != 0){
		execute_script('get_student_data', student_id, student_change_followup);
	}	
}

//Afhandeling van de veranderde student
function student_change_followup(data)
{
	//Plaats de leerling naam in de titel + plaats zijn ID  op de parent
	let student_name = data.student.ll_voornaam+' '+data.student.ll_naam;
	let title = document.querySelector('.title');
	title.setAttribute('data-student-id', data.student.ll_id);
	title.innerHTML = student_name;

	//Maak de 'Opslaan' button toegankelijk
	let save_button = document.querySelector('.confirm-student');
	save_button.removeAttribute("disabled");

	//Vul de student zijn gipevaluaties in
	fill_table(data.gipevaluaties);
}

function fill_table(evaluaties)
{
	//Maak alle invulvelden in de tabel opnieuw leeg & beschikbaar
	let row_input_fields = document.querySelectorAll('.row-input');
	row_input_fields.forEach(function(row_input_field) {
		row_input_field.removeAttribute("disabled");
		row_input_field.value = '';
	});

	let ratings = document.querySelectorAll('.rating');
	ratings.forEach(function(rating) {
		rating.innerHTML = '';
	});

	//Zoek al ingevulde evaluaties en vul ze in ze op de correcte plaats
	let table_rows = document.querySelectorAll('.gip-table tr');
	table_rows.forEach(function(table_row) {
		evaluaties.forEach(function(evaluatie) {
			if(table_row.getAttribute('data-id') == evaluatie.ge_gipvak_fk) {
				table_row.childNodes[1].childNodes[0].value = evaluatie.ge_score;
				table_row.childNodes[3].childNodes[0].value = evaluatie.ge_opmerking;
				update_score(evaluatie.ge_score, table_row.childNodes[2]);
			}
		});
	});

	add_table_input_handlers();
}

/* =============================
			Deel 3
============================= */

function save_clicked()
{
	//update button to loading icon
	let save_button = document.querySelector('.confirm-student');
	save_button.classList.add("is-loading");
	save_button.setAttribute("disabled", "disabled");

	//Lees alle data uit (student + evaluaties)
	let data = [];
	let title = document.querySelector('.title');
	let student_id = title.getAttribute('data-student-id');

	let table_rows = document.querySelectorAll('.gip-table tr');
	table_rows.forEach(function(row) {
		let save_obj = {
			'student_id': student_id,
			'gipvak_id': row.getAttribute('data-id'),
			'score': row.childNodes[1].childNodes[0].value,
			'note': row.childNodes[3].childNodes[0].value
		}
		data.push(save_obj);
	});

	data = JSON.stringify(data);

	//Schrijf weg naar db
	execute_script('save_student', data, save_followup);
}

function save_followup(response)
{
	if(response){
		let save_button = document.querySelector('.confirm-student');
		save_button.classList.remove("is-loading");
		save_button.innerHTML = 'Success!';

		setTimeout(
		    function() {
		      save_button.innerHTML = 'Opslaan';
		      save_button.removeAttribute("disabled");
		    }, 1000);
	}
}

function update_score(score, field)
{
	let ratings = [
		"",
		"Totaal onvoldoende",
		"Onvoldoende",
		"Voldoende",
		"Goed",
		"Zeer goed"
	]
	field.innerHTML = ratings[score] != undefined ?  ratings[score] : '';
}

function add_table_input_handlers()
{
	//Pijltjes functionaliteit in de tabel
	let table_inputs = document.querySelectorAll('.row-input');
	for ( let i=0; i < table_inputs.length; i++ ) {
		table_inputs[i].addEventListener('keydown', function(e) {
		    switch(e.keyCode){
		    	case 37:
		    		//left
		    		e.preventDefault();
		    		find_field(this.tabIndex-1);
		    		break;
		    	case 38:
		    		//up
		    		e.preventDefault();
		    		find_field(this.tabIndex-2);
		    		break;
		    	case 39:
		    		//right
		    		e.preventDefault();
		    		find_field(this.tabIndex+1);
		    		break;
		    	case 40:
		    		//down
		    		e.preventDefault();
		    		find_field(this.tabIndex+2);
		    		break;
		    	case 13:
		    		//down
		    		e.preventDefault();
		    		find_field(this.tabIndex+2);
		    		break;
		    }
		}); 
	}

	//Automatische rating
	let score_inputs = document.querySelectorAll('.score');
	for ( let i=0; i < score_inputs.length; i++ ) {
		score_inputs[i].addEventListener('keyup', function(e) {
			e.preventDefault();
			let score = this.value;
			let rating_field = this.parentNode.parentNode.childNodes[2];
			update_score(score, rating_field);
		});
	}
}

function find_field(index)
{
	let row_inputs = document.querySelectorAll('.row-input');
	for ( let i=0; i < row_inputs.length; i++ ) {
		if(row_inputs[i].tabIndex == index){
			row_inputs[i].focus();
			row_inputs[i].select();
		}
	}
}

/**
 *	execute_script is een basic AJAX request die je kan uitvoeren naar een PHP script naar keuze
 *	@script is een string die de filename van het PHP script bevat, vb: get_student_data -> get_student_data.php
 *	@data is een string met daarin de data die je naar dat script wil sturen
 *	@callback is een string die de naam bevat van de Javascript functie die je wil uitvoeren met het antwoord (niet verplicht)
 *	alle data, zowel heen als terug, is JSON
 */
function execute_script(script, data, callback = false)
{
	let xhr = new XMLHttpRequest();
	xhr.open('POST', 'scripts/'+script+'.php', true);
	xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
	xhr.send(data);
	xhr.onreadystatechange = function() {
	    if(xhr.readyState == 4 && xhr.status == 200 && callback !== false) {   
        	let response = JSON.parse(xhr.responseText);
        	callback(response); 
	    }
	}
}

/**
 *	add_handlers voegt event listeners toe aan alle nodige elementen (die bestaan bij page load)
 *	zoals de dropdowns links, de score inputvelden en de opslaanknop
 *	Bij elk element wordt een functie meegegeven die dan uitgevoerd zal worden
 *	vb: class_dropdown (de dropdown van de klassen) -> change -> functie 'class_changed' wordt uitgevoerd
 */
function add_handlers()
{
	//Klas dropdown
	let class_dropdown = document.querySelector('.class-select');
	class_dropdown.addEventListener('change', function(e) {
		e.preventDefault();
		class_changed();
	});

	//Student dropdown
	let student_dropdown = document.querySelector(".student-select");
	student_dropdown.addEventListener('change', function(e) {
		e.preventDefault();
		student_changed();
	});

	//Opslaan-knop
	let save_button = document.querySelector('.confirm-student');
	save_button.addEventListener('click', function(e) {
		e.preventDefault();
		save_clicked();
	});
}

add_handlers();