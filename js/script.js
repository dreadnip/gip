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
	execute_script('get_class_data', class_id, class_change_followup);
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
}

function change_student_dropdown(students)
{
	//Laad studenten van de gekozen klas in de dropdown
	let student_dropdown = document.querySelector(".student-select");
	student_dropdown.innerHTML = "<option>Maak een keuze</option>";

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

	gipvakken.forEach(function(gipvak) {
		//For each gipvak -> build a table row
	    let row = document.createElement("tr");
	    row.setAttribute('data-gipvak-id', gipvak.gv_id);
	    //header
	    let header = document.createElement("th");
	    header.textContent = gipvak.gv_datum + ' | ' + gipvak.gv_code;
	    //score input
	    let score_input = document.createElement("td");
	    score_input.classList.add('is-narrow', 'has-input');
	    let score_input_field = document.createElement("input");
	    score_input_field.classList.add('input', 'row-input', 'score');
	    score_input_field.setAttribute('type', 'text');
		score_input_field.setAttribute('value', '');
		score_input_field.setAttribute('disabled', 'disabled');
	    score_input.appendChild(score_input_field);
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
	    note.appendChild(note_field);

	    row.appendChild(header);
	    row.appendChild(score_input);
	    row.appendChild(rating);
	    row.appendChild(note);

	    //add the row to the table
	    gip_table.appendChild(row);
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
	execute_script('get_student_data', student_id, student_change_followup);
}

//Afhandeling van de veranderde klas
function student_change_followup(data)
{
	//Plaats de leerling naam in de titel + plaats zijn ID  op de parent
	let student_name = data.student.ll_voornaam+' '+data.student.ll_naam;
	let title = document.querySelector('.title');
	title.innerHTML = student_name;

	//Maak de 'Opslaan' button toegankelijk
	let save_button = document.querySelector('.confirm-student');
	save_button.removeAttribute("disabled");

	//Vul de student zijn gipevaluaties in
	fill_table(data.gipevaluaties);
}

function fill_table(evaluaties)
{
	//Maak alle invulvelden in de tabel beschikbaar
	let row_input_fields = document.querySelectorAll('.row-input');
	row_input_fields.forEach(function(row_input_field) {
		row_input_field.removeAttribute("disabled");
		row_input_field.value = '';
	});

	//Zoek al ingevulde evaluaties en vul ze in ze op de correcte plaats
	let table_rows = document.querySelectorAll('.gip-table tr');
	table_rows.forEach(function(table_row) {
		evaluaties.forEach(function(evaluatie) {
			if(table_row.getAttribute('data-gipvak-id') == evaluatie.ge_gipvak_fk) {
				table_row.childNodes[1].childNodes[0].value = evaluatie.ge_score;
				table_row.childNodes[3].childNodes[0].value = evaluatie.ge_opmerking;
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
	save_button.setAttribute("class", save_button.getAttribute("class")+" is-loading");
	save_button.setAttribute("disabled", "disabled");

	//Lees alle data uit (student + evaluaties)

	//Schrijf weg naar db
	execute_script('save_student', data, save_followup);
}

function save_followup(response)
{
	//error handling?
}

function update_score(score, index)
{
	let ratings = [
		"",
		"Totaal onvoldoende",
		"Onvoldoende",
		"Voldoende",
		"Goed",
		"Zeer goed"
	]
	let rating_cells = document.querySelectorAll('.rating');
	if (score >= 0 && score <= 5 && score){
		rating_cells[index].innerHTML = ratings[score];
	}else{
		rating_cells[index].innerHTML = "";
	}
}

function add_table_input_handlers()
{
	let table_inputs = document.querySelectorAll('.row-input');
	for ( let i=0; i < table_inputs.length; i++ ) {
		table_inputs[i].addEventListener('keydown', function(e) {
		    switch(e.keyCode){
		    	case 37:
		    		//left
		    		if(this.classList.contains('score')){
		    			if(this.parentNode.parentNode.previousElementSibling !== null){
		    				let previous_note = this.parentNode.parentNode.previousElementSibling.childNodes[3].childNodes[0];
		    				previous_note.focus();
		    			}
		    		} else if(this.classList.contains('note')){
		    			let previous_score = this.parentNode.parentNode.childNodes[1].childNodes[0];
		    			previous_score.focus();
		    		}
		    		break;
		    	case 38:
		    		//up
		    		if(this.classList.contains('score')){
		    			if(this.parentNode.parentNode.previousElementSibling !== null){
		    				let previous_score = this.parentNode.parentNode.previousElementSibling.childNodes[1].childNodes[0];
		    				previous_score.focus();
		    			}
		    		} else if(this.classList.contains('note')){
		    			if(this.parentNode.parentNode.previousElementSibling !== null){
		    				let previous_note = this.parentNode.parentNode.previousElementSibling.childNodes[3].childNodes[0];
		    				previous_note.focus();
		    			}
		    		}
		    		break;
		    	case 39:
		    		//right
		    		if(this.classList.contains('score')){
		    			let next_note = this.parentNode.parentNode.childNodes[3].childNodes[0];
		    				next_note.focus();
		    		} else if(this.classList.contains('note')){
		    			if(this.parentNode.parentNode.nextElementSibling !== null){
		    				let next_score = this.parentNode.parentNode.nextElementSibling.childNodes[1].childNodes[0];
		    				next_score.focus();
		    			}
		    		}
		    		break;
		    	case 40:
		    		//down
		    		if(this.classList.contains('score')){
		    			if(this.parentNode.parentNode.nextElementSibling !== null){
		    				let next_score = this.parentNode.parentNode.nextElementSibling.childNodes[1].childNodes[0];
		    				next_score.focus();
		    			}
		    		} else if(this.classList.contains('note')){
		    			if(this.parentNode.parentNode.nextElementSibling !== null){
		    				let next_note = this.parentNode.parentNode.nextElementSibling.childNodes[3].childNodes[0];
		    				next_note.focus();
		    			}
		    		}
		    		break;
		    }
		}); 
	}
}

function find_child(parent, className)
{
	var el = null;
	for (var i = 0; i < parent.childNodes.length; i++) {
	    if (parent.childNodes[i].className == className) {
	      el = parent.childNodes[i];
	      return el;
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
 *	add_handlers voegt event listeners toe aan alle nodige elementen
 *	zoals de dropdowns links, de score inputvelden en de opslaanknop
 *	Bij elk element wordt een functie meegegeven die dan uitgevoerd zal worden
 *	vb: class_dropdown (de dropdown van de klassen) -> change -> functie 'class_changed' wordt uitgevoerd
 */
function add_handlers()
{
	//DKlas dropdown
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

	//De verzameling van alle score inputvelden
	let score_inputs = document.querySelectorAll('.score');
	for ( let i=0; i < score_inputs.length; i++ ) {
		score_inputs[i].addEventListener('keyup', function(e) {
			e.preventDefault();
			let score = this.value;
			let row_index = this.parentNode.parentNode.getAttribute('data-gipvak-id');
			update_score(score, row_index);
		});
	}

	//Opslaan-knop
	let save_button = document.querySelector('.confirm-student');
	save_button.addEventListener('click', function(e) {
		e.preventDefault();
		save_clicked();
	});
}

add_handlers();