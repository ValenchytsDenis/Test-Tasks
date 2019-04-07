<?php
require_once('connect_db.php');
if (isset($_POST['fTown'])){
    $fTown = $_POST['fTown']."%";

    $link = mysqli_connect($host, $user, $password, $database) or die ('Ошибка: '.mysqli_error($link));
    mysqli_query($link, "SET NAMES 'utf8'");

    $query = "SELECT name FROM city WHERE name LIKE '$fTown'";
    $result = mysqli_query($link, $query) or die ('Ошибка: '.mysqli_error($link));

    $str = '';
    while ($row = mysqli_fetch_row($result)){
        $str .= "<option>".$row[0]."</option><br />";
    }
    echo $str;

    mysqli_free_result($result);
    mysqli_close($link);
}
if(isset($_POST['user_type']) && isset($_POST['emailRes']) && isset($_POST['telRes']) && isset($_POST['town']) && isset($_POST['heading'])){

    $town = $_POST['town'];

    $link = mysqli_connect($host, $user, $password, $database) or die ('Ошибка: '.mysqli_error($link));
    mysqli_query($link, "SET NAMES 'utf8'");

    $query = "SELECT name FROM country WHERE id = (
        SELECT country_id FROM region WHERE id = (
            SELECT region_id FROM city WHERE name = '$town'
        ) 
    )";
    $result = mysqli_query($link, $query) or die ('Ошибка: '.mysqli_error($link));

    $str = '';
    while ($row = mysqli_fetch_row($result)){
        $str .= $row[0];
    }
    echo $str;

    mysqli_free_result($result);
    mysqli_close($link);
}
if (isset($_POST['category'])){
    
    require_once('PHPExcel.php');

    $categories = array('Налоговый аудит',
                    'Бухгалтерские и аудиторские услуги',
                    'Инженерно-строительные услуги',
                    'Маникюр',
                    'Буровые работы',
                    'Бурение скважин под воду',
                    'Услуги изготовления и обслуживания бытовых товаров');
    $select = '';
    for ($x=0; $x<count($categories); $x++){
        $category = $categories[$x];
        $file = "categories.xlsx";
        $excel = PHPExcel_IOFactory::createReaderForFile($file);
        $xls = $excel->load($file);
        $sheet = $xls->getSheet(0);
        $num = $sheet->getHighestRow();
        $list = $category;
        for($i=2; $i<=$num; $i++){
            $B = $sheet->getCell('B'.$i)->getValue();
            if ($B == $category) {
                $C = $sheet->getCell('C'.$i)->getValue();
                for ($i=2; $i<=$num; $i++){
                    $A = $sheet->getCell('A'.$i)->getValue();
                    if ($C == $A){
                        $name = $sheet->getCell('B'.$i)->getValue();
                        $list .= '/'.$name;
                        $C = $sheet->getCell('C'.$i)->getValue();
                        $i = 2;
                    }
                }
            }
        }
        $select .= '<option>'.$list.'</option>';
    }
    echo $select;
}
