<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gip evaluatie</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css" integrity="sha256-eZrrJcwDc/3uDhsdt61sL2oOBY362qM3lon1gyExkL0=" crossorigin="anonymous" />
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,700" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/bulma/0.6.0/css/bulma.min.css" integrity="sha256-HEtF7HLJZSC3Le1HcsWbz1hDYFPZCqDhZa9QsCgVUdw=" crossorigin="anonymous" />
  <link rel="stylesheet" type="text/css" href="./css/style.css">
</head>
<body>

  <?php require __DIR__.'/db.php'; //Load the database file se we can read from db ?>

  <section class="container">
    <div class="columns">

      <div class="column controls">

        <!-- Schooljaar dropdown -->
        <div class="field">
          <label class="label">Jaar</label>
          <div class="control has-icons-left">
            <div class="select is-fullwidth">
              <select class="year-select" tabindex="1">
                <option value='0'>Maak een keuze</option>
                <option>2016-2017</option>
                <option>2017-2018</option>
                <option>2018-2019</option>
              </select>
            </div>
            <span class="icon is-small is-left">
              <i class="fa fa-calendar"></i>
            </span>
          </div>
        </div>

        <!-- Klas dropdown -->
        <div class="field">
          <label class="label">Klas</label>
          <div class="control has-icons-left">
            <div class="select is-fullwidth">
              <select class="class-select" tabindex="1">
                <option value='0'>Maak een keuze</option>
                <?php
                $classes = get_classes();
                var_dump($classes);
                foreach ($classes as $class) {
                  echo '<option value="'.$class->kl_id.'">'.$class->kl_code.'</option>';
                }
                ?>
              </select>
            </div>
            <span class="icon is-small is-left">
              <i class="fa fa-users"></i>
            </span>
          </div>
        </div>

        <!-- Leerling dropdown -->
        <div class="field">
          <label class="label">Leerling</label>
          <div class="control">
            <div class="select is-fullwidth">
              <select class="student-select" tabindex="1" disabled>
                <option>Kies eerst een klas</option>
              </select>
            </div>
          </div>
        </div>

        <a class="button is-success is-block confirm-student" href="#" tabindex="999" disabled>Opslaan</a>

      </div>

      <div class="column content is-9">

        <h4 class="title">Selecteer een klas en leerling om te beginnen</h4>

        <div class="box">
          <table class="table">
            <thead>
              <tr>
                <th>Gipvak</th>
                <th>Score</th>
                <th class='rating-head'>Waardering</th>
                <th>Opmerking</th>
              </tr>
            </thead>
            <tbody class="gip-table">
              <!-- Wordt volledig via JS opgevuld -->
            </tbody>
          </table>
        </div>

      </div>

    </div>
  </section>

  <script async type="text/javascript" src="./js/script.js"></script>
</body>
</html>