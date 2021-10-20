month = 4;
day = 23; 
year = 2001;
yes = string(y);
no = string(n);

$step1 = Number(year[2]+year[3]);
$step2 = parseInt(step1/4);
$step3 = step2 + step1;
$step4 = step3 + 1;
$step6 = step4 + step3;
$step7 = step6 + day;
$step8 = step7 - 1;
$step8%7;