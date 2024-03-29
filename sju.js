/* Date() 함수에서 날짜 형식 출력 하는 방법 (함수)
자바스크립트에서 Date() 날짜 함수를 이용해서 특정 형식으로 년, 월, 일, 시간 등을 출력 할때 출력 format 함수가 없어서 고생하는 경우가 많다.
그래서 함수로 만들어서 사용하면 편리하다
*/

Date.prototype.format = function (f) {
    if (!this.valueOf()) return " ";
    let weekKorName = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    let weekKorShortName = ["일", "월", "화", "수", "목", "금", "토"];
    let weekEngName = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let weekEngShortName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let d = this;

    return f.replace(/(yyyy|yy|MM|dd|KS|KL|ES|EL|HH|hh|mm|ss|a\/p)/gi, function ($1) {
        switch ($1) {
            case "yyyy": return d.getFullYear(); // 년 (4자리)
            case "yy": return (d.getFullYear() % 1000).zf(2); // 년 (2자리)
            case "MM": return (d.getMonth() + 1).zf(2); // 월 (2자리)
            case "dd": return d.getDate().zf(2); // 일 (2자리)
            case "KS": return weekKorShortName[d.getDay()]; // 요일 (짧은 한글)
            case "KL": return weekKorName[d.getDay()]; // 요일 (긴 한글)
            case "ES": return weekEngShortName[d.getDay()]; // 요일 (짧은 영어)
            case "EL": return weekEngName[d.getDay()]; // 요일 (긴 영어)
            case "HH": return d.getHours().zf(2); // 시간 (24시간 기준, 2자리)
            case "hh": return ((h = d.getHours() % 12) ? h : 12).zf(2); // 시간 (12시간 기준, 2자리)
            case "mm": return d.getMinutes().zf(2); // 분 (2자리)
            case "ss": return d.getSeconds().zf(2); // 초 (2자리)
            case "a/p": return d.getHours() < 12 ? "오전" : "오후"; // 오전/오후 구분
            default: return $1;
        };
    });
};

String.prototype.string = function (len) { let s = '', i = 0; while (i++ < len) { s += this; } return s; };
String.prototype.zf = function (len) { return "0".string(len - this.length) + this; };
Number.prototype.zf = function (len) { return this.toString().zf(len); };
	
//--- 사용법은    dd.format('yyyy-MM-dd HH:mm') ===> 결과:  '2021-10-15 15:28'


//=========== 음력 조회 함수 ===========
$( function() {
	$( 'button#submit' ).click( function() {
		let ad2 = ""; let devd = null;
		ad2 = "1881-01-29"; devd = new Date(ad2);  //---- 초기 시작일(전일,양력)
		$('#sola').empty();
		bdat = document.getElementById('bday').value;
		Lbday = new Date(bdat.substr(0,4), bdat.substr(4,2)-1, bdat.substr(6,2)).format('yyyy-MM-dd');
		mtyp = $('input[name="isLeap"]:checked').val();
		subj = Lbday.substr(0,4); temp = ca11_lunar_cal.filter(isFind);
		v = Number(Lbday.substr(5,2));  //---- 월(음력)
			cnt = Number(temp[0][1]);   //---- 누적일수
		n = 0; m = 1;
		while (m < v){
			if (temp[0][n+2]>"2")	{
				cnt += 26 + Number(temp[0][n+2]);
			}else{
				if (temp[0][n+2]>"0")	{
					cnt += 28 + Number(temp[0][n+2]);
					m += 1;
				};
			};
			n += 1;
		};
		if (mtyp === "0"){
			if (temp[0][v+2]>"2"){
				cnt += 28 + Number(temp[0][v+1]);
			}else{	document.getElementById("sola").innerText += " 평달입니다. ";};
		};
		cnt += Number(Lbday.substr(8,2));
		birt = new Date(devd.setDate(devd.getDate() + cnt));
		Sbday = birt.format('yyyy-MM-dd');
		$("#sola").show();
		document.getElementById("sola").innerText += "음력 " + Lbday + "의 양력 날짜는 " + Sbday; 
		$('input#bday').val('');
	});
});

//=========== 양력을 음력으로 변환 함수 ===========
function slr2lnr(birth0){
	let ad2 = ""; let devd = null;
	ad2 = "1881-01-29 23:59"; devd = new Date(ad2);  //---- 초기 시작일(전일,양력)
	cnt = Math.ceil((birth0.getTime()-devd.getTime()+1800000)/86400000);
	for (i=0; i<ca11_lunar_cal.length; i++){
		if (ca11_lunar_cal[i][1] > cnt){
			yn = ca11_lunar_cal[i-1][0];
			subj = yn;
			temp1 = ca11_lunar_cal.filter(isFind);
			break;
		};
	};
	cnt = cnt - temp1[0][1]; n = 2; m = 1;
	while (cnt > 30){
		if (temp1[0][n] > "2"){
			cnt = cnt - (26 + Number(temp1[0][n]));
			n += 1;
		}else{
			if (temp1[0][n] > "0"){
				cnt = cnt - (28 + Number(temp1[0][n]));
				n += 1;
				m += 1;
			};
		};
	};
	if (temp1[0][n] > "2"){
		if (cnt > 26 + Number(temp1[0][n])){
			cnt = cnt - (26 + Number(temp1[0][n]));
			mn = String(m).padStart(2,"0");
			dn = String(cnt).padStart(2,"0");
		}else{
			m -= 1;
			mn = String(m).padStart(2,"0") + "윤";
			dn = String(cnt).padStart(2,"0");
		};
	}else{
		if (temp1[0][n] > "0"){
			if (cnt > 28 + Number(temp1[0][n])){
				cnt = cnt - (26 + Number(temp1[0][n]));
				m += 1;
				mn = String(m).padStart(2,"0");
				dn = String(cnt).padStart(2,"0");
			}else{
				mn = String(m).padStart(2,"0");
				dn = String(cnt).padStart(2,"0");
			};
		};
	};	
	lnrd = yn + "-" + mn + "-" + dn;
};

//========= 화면 지우기 ========
$( function() {
	$('button#clear1').click( function() {
		location.reload();
	});
});

//=== 제출버튼 클릭시 실행되는 함수
$( function() {
	$( 'button#submit1' ).click( function() {
		$('select#sel_dt').empty(); sjtx = ""; cssn = 1;
		sjmain(); 
	});
});

//=========== 사주 입력시 실행되는 main 함수 ===========
function sjmain(){
		//------------------ 변수값 clear RESET start -------------------
		sj_yg = ""; sj_mg = ""; sj_dg = ""; sj_tg = "";  //--- 사주 (년월일시)간
		sj_yj = ""; sj_mj = ""; sj_dj = ""; sj_tj = "";  //--- 사주 (년월일시)지
		birth = ""; birth0 = null; birth1 = null; sj_list = []; 
		
		$('input#bday').val('');
		$('#sola').empty();
		$("#sola").hide();
		$('#output0').empty();
		$('#output1').empty();
		$('#output1a').empty();
		$('#output2').empty();
		$('#output3').empty();
		$('#output3a').empty();
		$('#output4').empty();
		$('#output5').empty();
		$('#outputa').empty();
		$('#outputb').empty();
		$('#ssal0').empty();
		$('#ssalb').empty();
		$('.huna').empty();
		$('.hunb').empty();
		$('.sj').empty();
		$('.sja').empty();
		$('.sjb').empty();
		$('.sjo').empty();
		$('.sju1').empty();
		$('.sju2').empty();
		$('.seu').empty();
		$('.mou').empty();
		$('.dau').empty();
		$('.hun1').empty();
		$('.hun2').empty();
		$('.hun3').empty();
		chg_bgcolor('.sj','#fff','#fff');
		
		ganhc_nfo = [
		["위치","gan","월-합오행","원국1","원국2","원국3","대운","연운","월운","일운","시운"],
		["연간","","","","","","","","","",""],
		["월간","","","","","","","","","",""],
		["일간","","","","","","","","","",""],
		["시간","","","","","","","","","",""]];

		jjhc_nfo = [
		["위치","jiji","합충형해파","원국1","원국2","원국3","대운","연운","월운","일운","시운"],
		["연지","","","","","","","","","",""],
		["월지","","","","","","","","","",""],
		["일지","","","","","","","","","",""],
		["시지","","","","","","","","","",""]];

		sinsal_nfo = [
		["기준","ganji","연지","월지","일지","시지","대운","연운","월운","일운","시운"],
		["연간","","","","","","","","","",""],
		["월간","","","","","","","","","",""],
		["일간","","","","","","","","","",""],
		["시간","","","","","","","","","",""],
		["연지","","","","","","","","","",""],
		["월지","","","","","","","","","",""],
		["일지","","","","","","","","","",""],
		["시지","","","","","","","","","",""]];

		gongmang_nfo = [
		["구분","旬","연지","월지","일지","시지","대운","연운","월운","일운","시운"],
		["순중(지지)","","","","","","","","","",""],
		["오행(천간)","","","","","","","","","",""],
		["사대(납음)","","","","","","","","","",""]];

		gj_nfo = [
		["위치","gan","g오행","g십성","통근","jiji","j오행","j십성","운성","장간1","장간2","장간3","1십성","2십성","3십성","비고"],
		["연주","","","","","","","","","","","","","","",""],["월주","","","","","","","","","","","","","","",""],["일주","","","","","","","","","","","","","","",""],["시주","","","","","","","","","","","","","","",""]];

		hgj_nfo = [
		["위치","gan","g오행","g십성","통근","jiji","j오행","j십성","운성","장간1","장간2","장간3","1십성","2십성","3십성","비고"],
		["대운","","","","","","","","","","","","","","",""],["연운","","","","","","","","","","","","","","",""],["월운","","","","","","","","","","","","","","",""],["일운","","","","","","","","","","","","","","",""],
		["시운","","","","","","","","","","","","","","",""]];

		hun_list = [
		["위치","gan","g오행","g십성","통근","jiji","j오행","j십성","운성","장간1","장간2","장간3","1십성","2십성","3십성","대운일"],
		["초대운","","","","","","","","","","","","","","",""],["2대운","","","","","","","","","","","","","","",""],["3대운","","","","","","","","","","","","","","",""],["4대운","","","","","","","","","","","","","","",""],
		["5대운","","","","","","","","","","","","","","",""],["6대운","","","","","","","","","","","","","","",""],["7대운","","","","","","","","","","","","","","",""],["8대운","","","","","","","","","","","","","","",""],
		["9대운","","","","","","","","","","","","","","",""],["10대운","","","","","","","","","","","","","","",""],["11대운","","","","","","","","","","","","","","",""],["12대운","","","","","","","","","","","","","","",""],
		["13대운","","","","","","","","","","","","","","",""],["14대운","","","","","","","","","","","","","","",""]];
		
		balance = [
		["구분","dj_인비","mj_인비","bal_인비","강약","인성","비겁","식상","재성","관성","비고"],
		["원국","","","","","","","","","",""],["종합","합","통근","충해파","결과","","","","","",""],["천간합","","","","","","","","","",""],["삼합","","","","","","","","","",""],["방합","","","","","","","","","",""],["육합","","","","","","","","","",""]];

		yongsin = [
		["구분","격국용신","억부","조후","병약","통관","종격","일행격","이행격","합화격","비고"],
		["격국","","","","","","","","","",""],["용신","","","","","","","","","",""],["희신","","","","","","","","","",""]];

		now = new Date();
		document.getElementById("hunDate").value = now.format('yyyy-MM-dd');  //--- 행운일자를 오늘로 설정(initial)
		saju_h = document.getElementById('sj').value;  //--- 직접 입력한 한글사주
		sjdat = document.getElementById('sjtm').value;  //--- 직접 입력한 생년월일(text)
		sjtim = document.getElementById('tm').value;  //--- 직접 입력한 생시(text)
		gendr = $('input[name="gender"]:checked').val();  //--- 성별
		hunD = document.getElementById('hunDate').value;  //--- 보려는 행운일자(text)
		if (sjdat != ""){
			if (sjtim == ""){ sjtx = "x"; sjtim = "06:00";};
			symdt = new Date(sjdat.substr(0,4), sjdat.substr(4,2)-1, sjdat.substr(6,2), sjtim.substr(0,2), sjtim.substr(3,2)).format('yyyy-MM-dd HH:mm');
			convrtsj(symdt);
			if (sjtx=="x"){tsj7 = ""; tsj8 = "";};
			saju = tsj1 + tsj2 + tsj3 + tsj4 + tsj5 + tsj6 + tsj7 + tsj8;
			birth = rqD; birth0 = rqD0; birth1 = rqD1;
		}else{
			saju_chk(saju_h);
			saju = saju_h;
		};

		subj = saju.substr(0,1); temp = gan.filter(isFindj); sj_yg = temp[0][0]; gj_nfo[1][1] = sj_yg;
		subj = saju.substr(1,1); temp = jiji.filter(isFindj); sj_yj = temp[0][0]; gj_nfo[1][5] = sj_yj;
		subj = saju.substr(2,1); temp = gan.filter(isFindj); sj_mg = temp[0][0]; gj_nfo[2][1] = sj_mg;
		subj = saju.substr(3,1); temp = jiji.filter(isFindj); sj_mj = temp[0][0]; gj_nfo[2][5] = sj_mj;
		subj = saju.substr(4,1); temp = gan.filter(isFindj); sj_dg = temp[0][0]; gj_nfo[3][1] = sj_dg;
		subj = saju.substr(5,1); temp = jiji.filter(isFindj); sj_dj = temp[0][0]; gj_nfo[3][5] = sj_dj;
		if (sjtx != "x"){
			subj = saju.substr(6,1); temp = gan.filter(isFindj); sj_tg = temp[0][0]; gj_nfo[4][1] = sj_tg;
			subj = saju.substr(7,1); temp = jiji.filter(isFindj); sj_tj = temp[0][0]; gj_nfo[4][5] = sj_tj;
		};
		mktable(1,sj_yg,sj_yj,gj_nfo);
		mktable(2,sj_mg,sj_mj,gj_nfo);
		mktable(3,sj_dg,sj_dj,gj_nfo);
		if (sjtx != "x"){ mktable(4,sj_tg,sj_tj,gj_nfo);};
		ganhc_nfo[1][1] = sj_yg; ganhc_nfo[2][1] = sj_mg; ganhc_nfo[3][1] = sj_dg; ganhc_nfo[4][1] = sj_tg; 
		ganhc_nfo[1][2] = ""; ganhc_nfo[2][2] = gj_nfo[2][6].substr(1,1); subj = sj_dg; temp = cgh02_dhap_simrihealth.filter(isFind); ganhc_nfo[3][2] = temp[0][2]; ganhc_nfo[4][2] = ""; 

		longun();
		seun();
 		moun();
		dayun();
		fill_saju();
		ganji_root();
		tugan();
		rootgchk();
		mpohcnt();
		inquir(balance[1]);
  		wongug();
		sinsal("#outputa");
//		spclcarac("#output0");
//		spclcarac1("#outputx");
		spclcarac2("#output0");
		gongmang("#output1a");
		setTimeout(hangun, 10);
		jagns(/정재/g, "정재");
		jagns(/편재/g, "편재");
		jagns(/정관/g, "정관");
		jagns(/정인/g, "정인");
		yong0();
		yong1();
		yong2();

};

//====== 시간(년월일시)을 사주로 변환하는 함수 ==========
function convrtsj(reqD){
	tsj1 = ""; tsj2 = ""; tsj3 = ""; tsj4 = ""; tsj5 = ""; tsj6 = ""; tsj7 = ""; tsj8 = "";
	
	rqD = ""; yrstart = ""; cor_t = ""; cor_d = 0; crh = 0; temp = []; temp1 = [];
	//--- 표준시/써머타임 (ca04_kstadj.csv) 시간 보정 ----------------------
	rqD0 = new Date(reqD.substr(0,16));  //--- 입력시간(date)
	for (i=1; i<ca04_kstadj.length; i++){
		if (reqD >= ca04_kstadj[i][0] && reqD <= ca04_kstadj[i][1]){
			crh = Number(ca04_kstadj[i][4]) * 1800000;  //--- 시간보정 수 (30분 * 개수)
		};
	};
	rqD1 = new Date(rqD0.getTime() - crh);  //--- 보정된 시간(date): 서울표준시
	rqD = rqD1.format('yyyy-MM-dd HH:mm');  //--- 보정시간(text)
	//--- 시지(sj_tj) 확인 ----------------------	
	rqD_t = rqD1.format('HH:mm');
	for ( i=1 ; i < ca05_sijitime.length ; i++ ){
		if (ca05_sijitime[i][0] <= rqD_t && ca05_sijitime[i][1] >= rqD_t){
			tsj8 = ca05_sijitime[i][2];  //--- 시지 (sj_tj)
			cor_t = String(Number(ca05_sijitime[i][3]) % 12);  //--- 시지 수 (시간 결정에 사용)
			cor_d = parseInt(Number(ca05_sijitime[i][3]) / 12);  //--- 일주 수 (일주 보정에 사용)
		};
	};
	//--- 일간(sj_dg) 확인 ----------------------
	ix = (Math.floor((rqD1.getTime() + 30600000 + crh) / 86400000) + 600077 + cor_d) % 10 + 1;
	tsj5 = ca09r_yjsjfind[1][ix];  //--- 일간 (sj_dg)
	//--- 시주 배열 만들기 / 시간(sj_tg) 확인 ---
	ttit = ca07_tjsjfind.slice(0, 1);  //---시주배열 이름 (첫줄) 가져오기
	subj = tsj5; tgtmp = ca07_tjsjfind.filter(isFind);  //---시주(일간 기준)
	tgtmp.unshift(ttit[0]);  //---시주배열 + 이름 추가
	for (i=1; i<tgtmp[0].length; i++){
		if (tgtmp[0][i] === cor_t){
			tsj7 = tgtmp[1][i].substr(0,1);   //--- 시간 (sj_tg)
		};
	};
	//--- 일지(sj_dj) 확인 ----------------------
	ix = (Math.floor((rqD1.getTime() + 30600000 + crh) / 86400000) + 600077 + cor_d) % 12 + 1;
	tsj6 = ca09r_yjsjfind[2][ix];  //--- 일지 (sj_dj)
	//--- 월지(sj_mj) 확인 ----------------------
	for ( i=1 ; i < ca08_monthstart.length ; i++ ){
		if (ca08_monthstart[i][5] <= rqD && ca08_monthstart[i+1][5] > rqD){
			premon = new Date(ca08_monthstart[i][5].substr(0,16));  //--- 이전절기 (대운수 계산시 사용)
			postmon = new Date(ca08_monthstart[i+1][5].substr(0,16));  //--- 다음절기 (대운수 계산시 사용)
			tsj4 = ca08_monthstart[i][2];  //--- 월지 (sj_mj)
			term = Number(ca08_monthstart[i][6]);  //--- 월 일수 (기간) 대운수 계산시 사용
		};
		if (ca08_monthstart[i][3] === '입춘' && ca08_monthstart[i][5].substr(0,4) === rqD1.format('yyyy')){
			yrstart = ca08_monthstart[i][5];  //--- 년 시작점(입춘) 년주 계산시 사용---입력시간(text)
		};
	};
	//--- 년간(sj_yg) 확인 ----------------------
	if (rqD < yrstart){ crnoy = 5 }else{ crnoy = 4 };  //--- 년도 보정수 (입춘이전 전년 년주 사용)
	ix = (rqD1.getFullYear() - crnoy) % 10 + 1;
	tsj1 = ca09r_yjsjfind[1][ix];  //--- 년간 (sj_yg)
	//--- 년지(sj_yj) 확인 ----------------------
	ix = (rqD1.getFullYear() - crnoy ) % 12 + 1;
	tsj2 = ca09r_yjsjfind[2][ix];  //--- 년지 (sj_yj)
	//--- 월주 배열 만들기 ----------------------
	ytit = ca06_mjsjfind.slice(1, 2);  //---월주배열 이름 (둘째줄) 가져오기
	subj = tsj1; ygtmp = ca06_mjsjfind.filter(isFind);  //---월주(년간 기준)
	ygtmp.unshift(ytit[0]);  //---월주배열 + 이름 추가
	idx = ygtmp[0].lastIndexOf(tsj4);
	tsj3 = ygtmp[1][idx].substr(0,1);  //--- 월간 (sj_mg)
};
	
//======= 사주 월간/시간 오류 check =======	
function saju_chk(saju_h){
	ya = saju_h.substr(0,1);yb = saju_h.substr(1,1);
	ma = saju_h.substr(2,1);mb = saju_h.substr(3,1);
	da = saju_h.substr(4,1);db = saju_h.substr(5,1);
	ta = saju_h.substr(6,1);tb = saju_h.substr(7,1);

	a = ca09r_yjsjfind[1].indexOf(ya);b = ca09r_yjsjfind[2].indexOf(yb);
	c = ca09r_yjsjfind[1].indexOf(ma);d = ca09r_yjsjfind[2].indexOf(mb);
	e = ca09r_yjsjfind[1].indexOf(da);f = ca09r_yjsjfind[2].indexOf(db);
	g = ca09r_yjsjfind[1].indexOf(ta);h = ca09r_yjsjfind[2].indexOf(tb);
	if (a >= b){ny = (a - b) * 6 + b;}else{ny = (10 + a - b) * 6 + b;}; //--- 년간/년지(a/b) 순번(ny)
	if (c >= d){nm = (c - d) * 6 + d;}else{nm = (10 + c - d) * 6 + d;}; //--- 월간/월지(c/d) 순번(nm)
	if (e >= f){nd = (e - f) * 6 + f;}else{nd = (10 + e - f) * 6 + f;}; //--- 일간/일지(e/f) 순번(nd)
	if (g >= h){nt = (g - h) * 6 + h;}else{nt = (10 + g - h) * 6 + h;}; //--- 시간/시지(g/h) 순번(nt)
	if (a > 5) {a = a - 5};
	if (d < 3){nma = a * 12 + d; }else{nma = (a - 1) * 12 + d; };
	if (nma > 60) {nma = nma - 60};
	if (e > 5) {e = e - 5};
	nta = (e - 1) * 12 + h;
	if (nta > 60){	nta = nta - 60;};	
	if (nm != nma || nt != nta){
		document.getElementById("output2").innerText += "생년월일 check : 사주가 맞지 않습니다.. " + saju_h + " \n";
	}else{
		mo = (nm + 11) % 12; if (mo == 0){mo = 12;}; //---- 월
		yr = ny + 1863; //---- 년도
		let year = now.getFullYear();	// 연도
		bsd = 117763200000; //--- 기준 갑자일(1908-01-10) = -1955836800000 + 2073600000000 = 117763200000 
		while (yr <= year){
			subj = yr; subj1 = mb;  //--- 년도, 월지를 이용하여 검색
			ns = ca08_monthstart.findIndex(isFindm); //---- mb월(양력) 시작일 확인 (index)
			if (ns != -1){
				startdate = new Date(ca08_monthstart[ns][5].substr(0,10)); //---- mb월(양력) 시작일
				enddate = new Date(ca08_monthstart[ns+1][5].substr(0,10)); //---- mb월(양력) 종료일
				sd = startdate.getTime() + 2073600000000; //--- 월 시작일(sd)
				co_s = Math.ceil(((sd - bsd)/86400000) % 60);  //--- 월 시작일의 60갑자 순번
				bs = parseInt(((sd - bsd)/86400000) / 60);
				bsd = bsd + bs * 5184000000;
				ed = enddate.getTime() + 2073600000000; //--- 월 종료일(ed)
				co_e = Math.ceil(((ed - bsd)/86400000) % 60);  //--- 월 종료일의 60갑자 순번
				if ((co_s < co_e && co_s <= nd && nd < co_e) || (co_s > co_e && (co_s <= nd || nd < co_e))){
						if (nd > co_s){	
						birth1 = new Date(startdate.setDate(startdate.getDate() + nd - co_s - 1));
						}else{
						birth1 = new Date(startdate.setDate(startdate.getDate() + nd + 60 - co_s - 1));
					};
					birth1.setTime(birth1.getTime() - 30600000);  //--- 시간 보정 (08:30)
					hrs = Number(ca09r_yjsjfind[3][h]);
					birth1.setHours(birth1.getHours() + hrs);  //--- 시간 입력(시지)
					birth1 = new Date(birth1); 
					for (i=1; i<ca04_kstadj.length; i++){
						crh = Number(ca04_kstadj[i][4]) * 1800000; 
						if ((new Date(ca04_kstadj[i][0]) - birth1) <= crh && (new Date(ca04_kstadj[i][1]) - birth1) >= crh){
							birth0 = new Date(birth1.getTime() + crh);
						};
					};
					birth = birth1.format('yyyy-MM-dd HH:mm');  //--- 입력시간(text)
					symdt = birth0.format('yyyy-MM-ddTHH:mm');  //--- 입력시간(text)
					premon = new Date(ca08_monthstart[ns][5].substr(0,16));  //--- 이전절기 (대운수 계산시 사용)
					postmon = new Date(ca08_monthstart[ns+1][5].substr(0,16));  //--- 다음절기 (대운수 계산시 사용)
					term = Number(ca08_monthstart[ns][6]);  //--- 월 일수 (기간) 대운수 계산시 사용
					document.getElementById("output2").innerText += "생년월일 : " + symdt + " (" + (year-yr+1) + "세) \n";
					sj_list.push(symdt);
				};
			};
			yr = yr + 60; //---- 년도 확인
		};
		if (sj_list.length >1){
			document.getElementById("output2").innerText += "---------------------- 생년월일 번호선택 ---- \n";
			$("#sel_dt").append('<option value="">생일선택</option>');
			sj_list.forEach((item)=>{$("#sel_dt").append('<option value="' + item + '">' + item + '</option>');});
		}
	};
};

//========= 같은사주의 날자가 2개 이상인 경우 하나를 선택 =========
$(function(){
	$('#sel_dt').change(function(){
		symdt = $("#sel_dt option:selected").val(); // 선택된 날자를 출력한다.  
		$('#sjtm').val(symdt.substr(0,4) + symdt.substr(5,2) + symdt.substr(8,2));
		$('#tm').val(symdt.substr(11,5));
		sjmain();
	});
});

//========= 원국 공망 check 하는 함수 =========
async function gongmang(d){
	jijigong = ""; ohgong = ""; gangong = ""; fourgong = ""; txt_gm = "";
	//---------- 순중(지지)공망 만들기 ----------
 	gjdev5 = sinsal_list2[0].indexOf(sj_dg);
 	gjdev6 = sinsal_list1[0].indexOf(sj_dj);
	gjdev = gjdev6 - gjdev5;  //--- 
	if (gjdev < 2){ gjdev += 12;};
	sq_sun = 7 - parseInt(gjdev / 2);
	jijigong = jiji[gjdev-1][0] + jiji[gjdev][0];
	gongmang_nfo[0][1] = sq_sun + gongmang_nfo[0][1]; gongmang_nfo[1][1] = jijigong;	
	//---------- (오행,천간,사대)공망 만들기 ----------
	subj = jiji[gjdev-1][0]; 
	if (subj == "戌"){
		ohgong = ""; gangong = ""; fourgong = "수"; gongmang_nfo[2][1] = gangong; gongmang_nfo[3][1] = fourgong;
	}else{
		tempn = jiji.filter(isFind); ohgong = tempn[0][2]; //--- 오행공망 만들기
		subj2 = ohgong; temp2 = gan.filter(isFind2); gangong = temp2[0][0] + temp2[1][0]; gongmang_nfo[2][1] = gangong; //--- 천간공망 만들기
		if (subj == "辰"){fourgong = "수";}; if (subj == "子" || subj == "午"){fourgong = "금";}; if (subj == "寅" || subj == "申"){fourgong = "";}; //--- 사대공망 만들기
		gongmang_nfo[2][1] = gangong; gongmang_nfo[3][1] = fourgong;
	};
	subj = jijigong; tempn = a_sungong.filter(isFind);
	txt_gm += "■ 공망--- 일주: " + gan[gjdev5][0] + " " + jiji[gjdev6][0] + " </br>";
	tagging("css_g", "spcs ", "txca", d, "", "", 0, "◐ 순중공망: " + jijigong, tempn[0][5]);
	if (ohgong != ""){tagging("css_g", "spcs ", "txca", d, "", "", 0, "◐ 오행공망: " + ohgong, tempn[0][6]);};
	txt_gm += "--------------------------------------------------------------</br>";
	await sun_gong(sj_yj,2,d); 
	await sun_gong(sj_mj,3,d); 
	await sun_gong(sj_dj,4,d); 
	await sun_gong(sj_tj,5,d);  //---------- 지지공망 체크 ----------
	await ocs_gong(sj_yg,"",2,d); 
	await ocs_gong(sj_mg,"",3,d); 
	await ocs_gong(sj_dg,"",4,d); 
	await ocs_gong(sj_tg,"",5,d);  //---------- 천간공망 체크 ----------
	await ocs_gong(sj_yg,sj_yj,2,d); 
	await ocs_gong(sj_mg,sj_mj,3,d);  //---------- 사대공망 체크 ----------
 	twsa1 = sinsal_list2[0].indexOf(sj_mg)+1; if (twsa1>10){twsa1 -= 10;};   //--- 태월 체크
	twsa2 = sinsal_list1[0].indexOf(sj_mj)+3; if (twsa2>12){twsa2 -= 12;}; 
	await ocs_gong(sinsal_list2[0][twsa1],sinsal_list1[0][twsa2],1,d);  //---------- 태월공망 체크 ----------
	$(d).append(txt_gm);

	$(d).on("click", "span", function(){ 
		disp("#"+$(this).attr("class").substr(5),"",""); 
	}); 
};

//========= 납음오행 계산 함수 =========
function nabeum(a,b){
	subj = a + b; tempg = a_nabeum.filter(isFind);
	nabg = tempg[0][2]; nab = nabg.substr(2,1);
};

//========= 지지공망 출력 확장 함수 =========
let cssn2 = 0;
function tagging(a,b,c,d,e,f,g,h,i){  //--- a: css prefix, b: span_css, c: div_css, d: destin, e: gan, f: jiji, g: pos_n, h: title, i: content
	cssn2 += 1; csno2 = a + cssn2;
	if (g==1){i = "* 태월이 공망되면 매사불성(每事不成)이고 정신적 측면에서 이상을 호소하는 경우가 많아 정서불안(情緖不安) 및 학문불리(學問不利) 현상이 나타난다.</br>* 특히 사대공망이 태월공망(胎月空亡)에 해당하면 뇌성마비 등의 정신질환에 취약하다.</br>그러나 사주가 청기하고 균형이 잡히면 반드시 비범성을 띄어 천재적 기질을 발휘하나, 그렇지 않으면 둔재로서 정신적 문제를 야기할 수 있으며 특히 육친의 흉화를 면키 어렵다.</br>* 한편, 태월공망과 관계없이 행운에서 태월을 충형(沖刑)하면 신체 손상 및 직업중단수의 우려가 있다.</br>" + i;};
	txt_gm += '<span class = "' + b + csno2 + '">' + h + '</span></br>';
	txt_gm += '<div id = "' + csno2 + '" class = "' + c + '">' + i + '</div>';
};

//========= 지지공망 체크 함수 =========
function sun_gong(f,g,d){
	return new Promise(function (resolve, reject){
		if (g==2){btxt = "연지";}; if (g==3){btxt = "월지";}; if (g==4){btxt = "일지";}; if (g==5){btxt = "시지";};  //--- if (g==7){btxt = "연운지";}; if (g==8){btxt = "월운지";}; if (g==9){btxt = "일운지";}; 
		if (jijigong.includes(f)==true){
			gongmang_nfo[1][g] = f; 
			subj = f; tempn = a_jjgong.filter(isFind);
			tagging("css_g", "spcs ", "txca", d, "", f, g, "◐ 지지공망: " + btxt + "__ " + f, tempn[0][5] + " </br> * 흉월: " + tempn[0][4] + " __ * 길월: " + tempn[0][3]);
			sibsng(sj_dg, "", f); subj = js_titl; temp = a_ssgong.filter(isFindj);
			if (g<6){
				tagging("css_g", "spcs ", "txca", d, "", f, g, "◐ " + btxt + "공망: " + subj, a_sjgong[(g-1)*2][1]);
			};
			if (temp[0][1].indexOf(subj)==0){idn = 5;}else{idn = 6;};
			tagging("css_g", "spcs ", "txca", d, "", f, g, "◐ " + temp[0][0] + ": " + temp[0][2] + "__ " + temp[0][3], temp[0][4] + "</br> * " + subj + "__ " + temp[0][idn]);
			txt_gm += "--------------------------------------------------------------</br>";
			console.log("원국 순중공망: " + jijigong + "__ " + btxt + "공망: " + f + "__ 합충형 상황==> 해공여부");
		};
		resolve();
	});
};

//========= (천간,사대)공망 체크 함수 =========
function ocs_gong(e,f,g,d){
	return new Promise(function (resolve, reject){
		if (f == ""){
			if (g==2){btxt = "연간";}; if (g==3){btxt = "월간";}; if (g==4){btxt = "일간";}; if (g==5){btxt = "시간";};  //--- if (g==7){btxt = "연운간";}; if (g==8){btxt = "월운간";}; if (g==9){btxt = "일운간";}; 
			if (gangong.includes(e)==true){
				gongmang_nfo[2][g] = e; 
				txt_gm += "◐ 천간공망: " + btxt + "__ " + e + "</br>";
				sibsng(sj_dg, e, ""); subj = gs_titl; temp = a_ssgong.filter(isFindj); 
				if (g<6){
					tagging("css_g", "spcs ", "txca", d, e, f, g, "◐ " + btxt + "공망: " + subj, a_sjgong[(g-2)*2+1][1]);
				};
				if (temp[0][1].indexOf(subj)==0){idn = 5;}else{idn = 6;};
				tagging("css_g", "spcs ", "txca", d, e, f, g, "◐ " + temp[0][0] + ": " + temp[0][2] + "__ " + temp[0][3], temp[0][4] + "</br> * " + subj + "__ " + temp[0][idn]);
				txt_gm += "--------------------------------------------------------------</br>";
				console.log("천간공망: " + gangong + "__ " + btxt + "공망: " + e + "__ 합충형 상황==> 해공여부");
			};
		}else{
			if (g==2){btxt = "연주";}; if (g==3){btxt = "월주";}; if (g==4){btxt = "일주";}; if (g==5){btxt = "시주";}; if (g==1){btxt = "태월";};
			nabeum(e,f); 
			if (nab == fourgong){
				gongmang_nfo[3][g] = nabg.substr(0,3); 
				tagging("css_g", "spcs ", "txca", d, e, f, g, "◐ 사대공망: " + btxt + "__ " + e + f + "__ " + nabg, " * " + tempg[0][3] + "</br> *" + tempg[0][6] + "__ " + tempg[0][7]);
				txt_gm += "--------------------------------------------------------------</br>";
			};
		}; 
		resolve();
	});
};

//========= 행운 공망 check 하는 함수 =========
async function gongmangh(d){
	txt_gmh = "";
	for (i=1; i<4; i++){
		for (j=6; j<10; j++){
			gongmang_nfo[i][j] = "";
		};
	};
	txt_gmh += "■ 공망--- 일주: " + gan[gjdev5][0] + " " + jiji[gjdev6][0] + " </br>";
	await sunh_gong(hn_yj,7,d); 
	await sunh_gong(hn_mj,8,d); 
	await sunh_gong(hn_dj,9,d);
	await ocsh_gong(hn_yg,"",7,d); 
	await ocsh_gong(hn_mg,"",8,d); 
	await ocsh_gong(hn_dg,"",9,d);
	await ocsh_gong(hn_yg,hn_yj,7,d); 
	await ocsh_gong(hn_mg,hn_mj,8,d); 
	await ocsh_gong(hn_dg,hn_dj,9,d);
	if (txt_gmh.length>67){
		$(d).append(txt_gmh);
		$(d).on("click", "span", function(){ 
			disp("#"+$(this).attr("class").substr(5),"",""); 
		}); 
	};
};

//========= 행운 지지공망 출력 확장 함수 =========
let cssn3 = 0;
function taggingh(a,b,c,d,e,f,g,h,i){  //--- a: css prefix, b: span_css, c: div_css, d: destin, e: gan, f: jiji, g: pos_n, h: title, i: content
	cssn3 += 1; csno3 = a + cssn3; 
	txt_gmh += '<span class = "' + b + csno3 + '">' + h + '</span></br>';
	txt_gmh += '<div id = "' + csno3 + '" class = "' + c + '">' + i + '</div>';
};

//========= 행운 지지공망 체크 함수 =========
function sunh_gong(f,g,d){
	return new Promise(function (resolve, reject){
		if (g==7){btxt = "연운지";}; if (g==8){btxt = "월운지";}; if (g==9){btxt = "일운지";}; 
		if (jijigong.includes(f)==true){
			gongmang_nfo[1][g] = f; 
			subj = f; tempp = a_jjgong.filter(isFind);
			taggingh("css_h", "spcs ", "txca", d, "", f, g, "◐ 지지공망: " + btxt + "__ " + f, tempp[0][5] + " </br> * 흉월: " + tempp[0][4] + " __ * 길월: " + tempp[0][3]);
			sibsng(sj_dg, "", f); subj = js_titl; temph = a_ssgong.filter(isFindj);
			if (temph[0][1].indexOf(subj)==0){idn = 5;}else{idn = 6;};
			taggingh("css_h", "spcs ", "txca", d, "", f, g, "◐ " + temph[0][0] + ": " + temph[0][2] + "__ " + temph[0][3], temph[0][4] + "</br> * " + subj + "__ " + temph[0][idn]);
			txt_gmh += "--------------------------------------------------------------</br>";
			console.log("순중공망: " + jijigong + "__ " + btxt + "공망: " + f + "__ 합충형 상황==> 해공여부");
		};
		resolve();
	});
};

//========= 행운 (천간,사대)공망 체크 함수 =========
function ocsh_gong(e,f,g,d){
	return new Promise(function (resolve, reject){
		if (f == ""){
			if (g==7){btxt = "연운간";}; if (g==8){btxt = "월운간";}; if (g==9){btxt = "일운간";}; 
			if (gangong.includes(e)==true){
				gongmang_nfo[2][g] = e; 
				txt_gmh += "◐ 천간공망: " + btxt + "__ " + e + "</br>";
				sibsng(sj_dg, e, ""); subj = gs_titl; temph = a_ssgong.filter(isFindj); 
				if (temph[0][1].indexOf(subj)==0){idn = 5;}else{idn = 6;};
				taggingh("css_h", "spcs ", "txca", d, e, f, g, "◐ " + temph[0][0] + ": " + temph[0][2] + "__ " + temph[0][3], temph[0][4] + "</br> * " + subj + "__ " + temph[0][idn]);
				txt_gmh += "--------------------------------------------------------------</br>";
				console.log("천간공망: " + gangong + "__ " + btxt + "공망: " + e + "__ 합충형 상황==> 해공여부");
			};
		}else{
			if (g==7){btxt = "연운";}; if (g==8){btxt = "월운";}; if (g==9){btxt = "일운";}; 
			nabeum(e,f); 
			if (nab == fourgong){
				gongmang_nfo[3][g] = nabg.substr(0,3); 
				taggingh("css_h", "spcs ", "txca", d, e, f, g, "◐ 사대공망: " + btxt + "__ " + e + f + "__ " + nabg, " * " + tempg[0][3] + "</br> *" + tempg[0][6] + "__ " + tempg[0][7]);
				txt_gmh += "--------------------------------------------------------------</br>";
			};
		}; 
		resolve();
	});
};

//========= 간지 배경색 =========
function chg_bgcolor(a,b,c) {
	$(a).css("background","linear-gradient(145deg," + b + ", 45%," + c + " 55%)");
}

//=========== 데이터 보이기 / 숨기기 =======	
function disp(a,b,c){
	if ($(a).css('display') == 'none'){	$(a).show();}else{$(a).hide();	};
	if (b != ""){if($(b).css('display') == 'none'){$(b).show();}else{$(b).hide();};};
	if (c != ""){if($(c).css('display') == 'none'){$(c).show();}else{$(c).hide();};};
};
	
//====== 배열에서 subj 를 가져오는 함수 ====== 부분배열 가져오기
function isFind(element)  {
	if(element[0] === subj)  {
		return true;
	};
};

//====== 배열에서 subj 를 가져오는 함수 ====== 부분배열 가져오기
function isFind2(element)  {
	if(element[2] === subj2)  {
		return true;
	};
};

//====== 십성배열에서 subj (지지) 를 가져오는 함수 ====== 부분배열 가져오기
function isFindj(element)  {
	if (element[1].includes(subj)) {
		return true;
	};
};

//====== 배열에서 subj 유사문자열 가져오는 함수 ====== 부분배열 가져오기
function isFindm(element)  {
	if(element[0].includes(subj) && element[2] == subj1)  {
		return true;
	};
};

//====== 배열에서 subj 를 가져오는 함수 ====== 부분배열 가져오기
function isFindx(element)  {
	if (element[0].includes(subj)) {
		return true;
	};
};

//--- 십성 긍부정심리/육친 검색 함수
//--- ss_simri("정재",cgh01_sibsng_simri6chin,1)    --- 1:긍정, 2:부정, 0:육친
function ss_simri(ss,arr,sel){
	subj = ss; temp = arr.filter(isFind); 
	if (sel == 0){
		if (gendr == "남양"){ rslt = temp[0][3];}else{ rslt = temp[0][4];};	
	}else{
		rslt = temp[0][sel];
	};
};

//====== 연지합 ===================
//--- yjhab(txd,"#output1");
function yjhab(dstin){
	return new Promise(function (resolve, reject){
		txd = "";	cssn4 += 1;
		txd += '■ <span class = "spcs css_gw' + cssn4 + '">연지합--- ' + txt + ' ' + rslt + '--- 일간의 연간 월간십성에 대한 부정심리 </span></br><div id = "css_gw' + cssn4 + '" class = "txca">';
		ss_simri(gj_nfo[1][3],cgh01_sibsng_simri6chin,2); txd += "◐ " + gj_nfo[1][3] + "심리( ~19세)--- " + rslt + "</br>";  //---연간십성 부정심리
		ss_simri(gj_nfo[2][3],cgh01_sibsng_simri6chin,2); txd += "◐ " + gj_nfo[2][3] + "심리(20~38세)--- " + rslt + "</br>";  //---월간십성 부정심리
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};
		
//====== 일지합 (1)===================
//--- djhab(txd,"#output1");
function djhab(dstin){
	return new Promise(function (resolve, reject){
		txd = "";	cssn4 += 1; 
		subj = rslt.substr(0,2); temp = spec_6hab.filter(isFind);
		txd += '■ <span class = "spcs css_gw' + cssn4 + '">일지합--- ' + txt + " " + rslt + '</span></br><div id = "css_gw' + cssn4 + '" class = "txca"> ◐ 심리적 고조. 오지랖 기운으로 새로운 일을 벌리나 결과는 시원치 않다</br> ◐ ' + sz + temp[0][1] + "</br>"; 
		if (dstin == "#output3"){txd += "◐ " + temp[0][2] + "</br>"; };
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};
		
//====== 연지충 ===================
//--- yjchng(txd,"#output1");
function yjchng(dstin){
	return new Promise(function (resolve, reject){
		txd = "";	cssn4 += 1;
		txd += '■ <span class = "spcs css_gw' + cssn4 + '">연지충--- ' + txt + " " + rslt + '--- 일간의 연지 월지십성에 대한 부정심리 </span></br><div id = "css_gw' + cssn4 + '" class = "txca">';
		ss_simri(gj_nfo[1][7],cgh01_sibsng_simri6chin,2); txd += "◐ " + gj_nfo[1][7] + "심리( ~19세)--- " + rslt + "</br>";  //---연지십성 부정심리
		ss_simri(gj_nfo[2][7],cgh01_sibsng_simri6chin,2); txd += "◐ " + gj_nfo[2][7] + "심리(20~38세)--- " + rslt + "</br>";  //---월지십성 부정심리
		ss_simri(gj_nfo[1][7],cgh01_sibsng_simri6chin,0); txd += "◐ 육친(" + rslt + ") 불화(반목) ( ~19세) </br>";	//--- 연지십성 육친관계 불화
		ss_simri(gj_nfo[2][7],cgh01_sibsng_simri6chin,0); txd += "◐ 육친(" + rslt + ") 불화(반목) (20~38세) </br>";  //--- 월지십성 육친관계 불화
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};
		
//====== 일지충 (2)===================
//--- djchng(txd,"#output1");
function djchng(dstin){
	return new Promise(function (resolve, reject){
		txd1 = "";	cssn4 += 1;
		txd1 += '■ <span class = "spcs css_gw' + cssn4 + '">일지충--- ' + txt + " " + rslt + '</span></br><div id = "css_gw' + cssn4 + '" class = "txca">';
		subj = rslt.substr(0,2); 
		temp = spec_jjchng.filter(isFind);
		if (dstin == "#output3"){
			txd1 += "◐ " + temp[0][1] + "</br> ◐ " + temp[0][2] + " </br>";
			txd1 += "◐ 왕신발 쇠자발--- </br>";
			jjg_turb();
		}else{
			txd1 += "◐ " + sz + temp[0][1] + "</br> ◐ " + temp[0][2] + " </br>";
		};
			txd1 += "◐ 원진귀문 있으면--- 이중성격 증후군(잔소리 폭언-술마시면 드러남) </br>";
		txd1 += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd1;}else{txt_jjhn += txd1;};
		resolve();
	});
};

//====== 연지해 ===================
function yjhae(dstin){
	return new Promise(function (resolve, reject){
		txd = "";	cssn4 += 1;
		txd += '■ <span class = "spcs css_gw' + cssn4 + '">연지해--- ' + txt + " " + rslt + '일간의 육합대상지지 십성에 대한 부정심리 </span></br><div id = "css_gw' + cssn4 + '" class = "txca">';	  //--- 연지해 -------
		subj = sj_yj; temp = spec_6hab.filter(isFindx); if (temp[0][0].substr(0,1) == sj_yj){tgt = temp[0][0].substr(1,1);}else{tgt = temp[0][0].substr(0,1);}; sibsng(sj_dg,"",tgt);
		ss_simri(js_titl,cgh01_sibsng_simri6chin,2); txd += "◐ " + js_titl + " 부정심리(0~19세)--- " + rslt + "</br>";
		subj = sj_mj; temp = spec_6hab.filter(isFindx); if (temp[0][0].substr(0,1) == sj_mj){tgt = temp[0][0].substr(1,1);}else{tgt = temp[0][0].substr(0,1);}; sibsng(sj_dg,"",tgt);
		ss_simri(js_titl,cgh01_sibsng_simri6chin,2); txd += "◐ " + js_titl + " 부정심리(20~38세)--- " + rslt + "</br>";
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

//====== 일지해 (3)===================
//--- djhae(sj_mj,sj_dj,2,txd,"#output1"); 또는 djhae(sj_dj,sj_tj,3,txd,"#output1");
function djhae(a,b,c,dstin){
	return new Promise(function (resolve, reject){
		txd = "";	cssn4 += 1;
		txd += '■ <span class = "spcs css_gw' + cssn4 + '">일지해--- ' + txt + " " + rslt + '--- 일간의 육합대상지지 십성에 흉화 </span></br><div id = "css_gw' + cssn4 + '" class = "txca"> ◐ ' + sz + " 엉뚱한 일을 발생시켜 뜻하지 않게 다투거나 냉담하게 되는 등 매사를 지연시켜 목전에서 포기하게 만드는 흉살이다. </br>";
		if (c == 2){txd += " ◐ 형제와 인연이 박함은 물론 배우자가 대체로 쇠약한 편인데 여명의 경우 흉해가 더 심하다. </br>";};
		if (c == 3){txd += " ◐ 배우자와 자식의 덕이 없을 뿐만 아니라 당주의 노년고독과 질병을 암시 </br>";};
		subj = rslt.substr(0,2); temp = spec_djhae.filter(isFind); txd += "◐ 육친에 흉화/병증--- " + temp[0][1] + "</br>";	  //--- 일지해 -------
		subj = a; temp = spec_6hab.filter(isFindx); if (temp[0][0].substr(0,1) == a){tgt = temp[0][0].substr(1,1);}else{tgt = temp[0][0].substr(0,1);}; sibsng(sj_dg,"",tgt);
		ss_simri(js_titl,cgh01_sibsng_simri6chin,0); txd += "◐ 육친(" + rslt + ") 흉화 </br>";  //---육합대상지지의 십성육친 흉화
		subj = b; temp = spec_6hab.filter(isFindx); if (temp[0][0].substr(0,1) == b){tgt = temp[0][0].substr(1,1);}else{tgt = temp[0][0].substr(0,1);}; sibsng(sj_dg,"",tgt);
		ss_simri(js_titl,cgh01_sibsng_simri6chin,0); txd += "◐ 육친(" + rslt + ") 흉화 </br>";  //---일지 육합대상지지의 십성육친 흉화
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

//====== 정지 (7)===================
function suspend(dstin){
	return new Promise(function (resolve, reject){
		txd = "";
		txd += rslt0 + " " + txt + " " + rslt + " </br>";  //--- 정지 (7)
		txd += "--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

//====== 합충+해 흉화 (8)===================
//--- hwunghwa(sj_dj,hnj,txd,"#output3");
function hwunghwa(a,b,dstin){
	return new Promise(function (resolve, reject){
		txd = "";	cssn4 += 1; 
		txd += '■ <span class = "spcs css_gw' + cssn4 + '">' + rslt0 + " " + txt + " " + rslt + '</span></br><div id = "css_gw' + cssn4 + '" class = "txca">';  //--- 합충-해흉화 (8)
		subj = rslt.substr(0,2); temp = spec_djhae.filter(isFind); 
		txd += "◐ " + sz + temp[0][1] + "</br>";
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

//====== 연지파 ===================
//--- yjpa(txd,"#output1");
function yjpa(dstin){
	return new Promise(function (resolve, reject){
		txd = "";	cssn4 += 1; 
		txd += '■ <span class = "spcs css_gw' + cssn4 + '">연지파--- ' + txt + " " + rslt + '--- 일간의 지지십성에 대한 부정심리 </span></br><div id = "css_gw' + cssn4 + '" class = "txca">';
		ss_simri(gj_nfo[1][7],cgh01_sibsng_simri6chin,2); txd += "◐ " + gj_nfo[1][7] + "심리( ~19세)--- " + rslt + "</br>";  //---연지십성 부정심리
		ss_simri(gj_nfo[2][7],cgh01_sibsng_simri6chin,2); txd += "◐ " + gj_nfo[2][7] + "심리(20~38세)--- " + rslt + "</br>";  //---월지십성 부정심리
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

//====== 일지파 (4)===================
//--- djpa(sj_mj,sj_dj,txd,"#output1"); 또는 djpa(sj_dj,sj_tj,txd,"#output1");
function djpa(a,b,dstin){
	return new Promise(function (resolve, reject){
		txd = "";	cssn4 += 1; 
		txd += '■ <span class = "spcs css_gw' + cssn4 + '">일지파--- ' + txt + " " + rslt + '--- 삼합왕지 십성육친에 흉화(암시) 및 동착에 실행 </span></br><div id = "css_gw' + cssn4 + '" class = "txca"> ◐ ' + sz + " 이탈 파괴 붕괴 분리 절단 반목 대립 파손 파재 이별을 암시하여 매사 장애를 촉발한다. 어떤 일의 중단을 예고하여 새로운 국면으로 전환시키는 역할을 담당하므로 파가 오면 일단 십성육신의 변화는 불가피하다. 파와 연관하는 모든 지지의 삼합 왕지에 변화를 준다.</br>";
		subj = a; temp = spec_samhab.filter(isFindx); tgt = temp[0][0].substr(1,1); sibsng(sj_dg,"",tgt); 
		ss_simri(js_titl,cgh01_sibsng_simri6chin,0); txd += "◐ 육친(" + rslt + ") 흉화 </br>";  //--- 일지 삼합왕지 십성육친
		subj = b; temp = spec_samhab.filter(isFindx); tgt = temp[0][0].substr(1,1); sibsng(sj_dg,"",tgt); 
		ss_simri(js_titl,cgh01_sibsng_simri6chin,0); txd += "◐ 육친(" + rslt + ") 흉화 </br>";  //--- 일지 삼합왕지 십성육친
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

//====== 지지형 구성체크 함수 ======
let ifo = false; let jjh_unsng = ""; let posd = ""; let pose = ""; let hcj = ""; let ttlhc = ""; let ttlh = "";
	//--- 지지형 e (기본)
function johhe_chk(a,dstin){
	subj = "0a"; temp = spec_jjhyung.filter(isFind);
	txd += '■<span class = "spcs css_gw' + cssn4 + '"><지지형>--- ' + txt + " " + rslt + '</span></br><div id = "css_gw' + cssn4 + '" class = "txca">◐ ' + temp[0][2] + "</br>"; 
	txd += "◐ 육친의 흉화--- </br>"; 
	for (k = 0; k < posd.length; k++){
		if (((k>0) && (rslt.includes("丑") || rslt.includes("戌") || rslt.includes("未"))) || ((k>0) && (rslt.includes("辰") || rslt.includes("午") || rslt.includes("酉") || rslt.includes("亥")))) {
			continue;
		}else{
			if (posd.substr(k,1) < "5"){  //--- 원국
				sibsTugsin(gj_nfo[Number(posd.substr(k,1))][7]); subj = hs_titl; temp = spec_jjhyung.filter(isFind); 
				txd += "◎ " + subj + "---" + temp[0][2] + "</br>";
				if (posd.length == 4 && (rslt.includes("辰") || rslt.includes("午") || rslt.includes("酉") || rslt.includes("亥"))){
					sibsTugsin(gj_nfo[3][7]); subj = hs_titl; temp = spec_jjhyung.filter(isFind); 
					txd += "◎ " + subj + "---" + temp[0][2] + "</br>";
				};
			}else{  //--- 행운
				sibsTugsin(hgj_nfo[Number(posd.substr(k,1))-4][7]); subj = hs_titl; temp = spec_jjhyung.filter(isFind); 
				txd += "◎ " + subj + "---" + temp[0][2] + "</br>";
			};
		};
	};
};
	
	//--- 지지형 a (삼형-인사신)
function johha_chk(a,dstin){
	return new Promise(function (resolve, reject){
		let jjh_unsng = ""; 	txd = "";	cssn4 += 1; rslt = rslt_hyng1;
		johhe_chk(a,dstin); //pose += posd;
		for (k = 0; k < posd.length; k++)	{
			if (posd.substr(k,1) < "5"){  //--- 원국
				jjh_unsng += gj_nfo[Number(posd.substr(k,1))][8];
			}else{  //--- 행운
				jjh_unsng += gj_nfo[3][8];
				jjh_unsng += hgj_nfo[Number(posd.substr(k,1))-4][8];
			};
		};
		subj = "1a"; temp = spec_jjhyung.filter(isFind);
		txd += "★★" + rslt + " 삼형--- </br>" + "◐ " + temp[0][2] + "</br>"; 
		subj = "1b"; temp = spec_jjhyung.filter(isFind);
		txd += "◐ " + temp[0][2] + "</br>"; 
		if ((pose.includes("12") || pose.includes("21")) && sj_yj != sj_mj){
			txd += "◐ 잔머리가 발달하여 홀로 겉도는 가운데 성격이 급하고 조열하여 마찰이 잦고 게다가 지구력이 약하여 자모자패(自謀自敗)의 전형적인 유형이다. 심리 불안정 초년 범죄 악행--- </br>"; 
		};
		if ((pose.includes("23") || pose.includes("32")) && sj_mj != sj_dj){
			txd += "◐ 부모형제와 마찰이 심한 편으로 해당 시기(20~57세)에 굴곡이 많음을 암시한다. 부모형제와 인연없음--- </br>"; 
		};
		if ((pose.includes("34") || pose.includes("43")) && sj_dj != sj_tj){
			txd += "◐ 처덕과 자식 복이 없는 가운데 직주(職住) 이동이 심하고 특히 여명은 낙태 등 산액이 있을 수 있다.--- </br>"; 
		};
		if (jjh_unsng.includes("장생") || jjh_unsng.includes("관대") || jjh_unsng.includes("건록") || jjh_unsng.includes("제왕")){
			txd += "◐ 생사여탈 직업군에서 두각을 나타낸다.(군 검 경 의사 종교인 활인업)--- </br>"; 
		};
		if (jjh_unsng.includes("사") || jjh_unsng.includes("절")){txd += "◐ 매사불성(每事不成)이며 흉사가 다반사로 일어나고 부부는 해로 문제로 갈등하게 된다.--- </br>";};

		if (a == 2){  //--- 행운
			txsj = sj_yj + sj_mj + sj_tj; txhn = hn_lj + hn_yj + hn_mj + hn_dj; txt1 = "";
			if (sj_dj == "寅" && txhn.includes("巳")){txt1 = "건강 이상";};
			if (sj_dj == "寅" && txhn.includes("申")){txt1 = "구설. 신경쇠약";};
			if (sj_dj == "巳" && txhn.includes("寅")){txt1 = "성격 변화";};
			if (sj_dj == "巳" && txhn.includes("申")){txt1 = "재물 손괴";};
			if (sj_dj == "申" && txhn.includes("寅")){txt1 = "편두통";};
			if (sj_dj == "申" && txhn.includes("巳")){txt1 = "관재 구설";};
			if (((sj_dj == "寅" && txsj.includes("巳")) || (sj_dj == "巳" && txsj.includes("寅"))) && txhn.includes("申")){txt1 = "골격계 질환. 대장. 순환기. 폐질환";};
			if (((sj_dj == "寅" && txsj.includes("申")) || (sj_dj == "申" && txsj.includes("寅"))) && txhn.includes("巳")){txt1 = "순환기 질환. 눈. 심장. 소장";};
			if (((sj_dj == "巳" && txsj.includes("申")) || (sj_dj == "申" && txsj.includes("巳"))) && txhn.includes("寅")){txt1 = "신경계. 간장. 임파. 갑상선";};
			if ((sj_ji.includes("寅") && sj_ji.includes("巳") && sj_ji.includes("申")) && txhn.includes("申")){txt1 = "골격계 질환. 대장. 순환기. 폐질환";};
			if ((sj_ji.includes("寅") && sj_ji.includes("巳") && sj_ji.includes("申")) && txhn.includes("巳")){txt1 = "순환기 질환. 눈. 심장. 소장";};
			if ((sj_ji.includes("寅") && sj_ji.includes("巳") && sj_ji.includes("申")) && txhn.includes("寅")){txt1 = "신경계. 간장. 임파. 갑상선";};
			txd += "◐ 삼형살 병증--- " + txt1 + "</br>"; 
		};
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

	//--- 지지형 b (붕형-축술미)
function johhb_chk(a,dstin){
	return new Promise(function (resolve, reject){
		txd = ""; cssn4 += 1;  rslt = rslt_hyng2;
		johhe_chk(a,dstin); 
		subj = "3a"; temp = spec_jjhyung.filter(isFind);
		txd += "★★" + rslt + " 붕형--- </br>" + "◐ " + temp[0][2] + "</br>"; 
		subj = "3b"; temp = spec_jjhyung.filter(isFind);
		txd += "◐ " + temp[0][2] + "</br>"; 
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

	//--- 지지형 c (상형-자묘)
function johhc_chk(a,dstin){
	return new Promise(function (resolve, reject){
		txd = "";	cssn4 += 1;  rslt = rslt_hyng3;
		johhe_chk(a,dstin); 
		subj = "2a"; temp = spec_jjhyung.filter(isFind);
		txd += "★★ " + rslt + " 상형--- " + "</br>" + "◐ " + temp[0][2] + "</br>"; 
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

	//--- 지지형 d (병존자형-진오유해)
function johhd_chk(a,dstin){
	return new Promise(function (resolve, reject){
		txd = ""; cssn4 += 1; rslt = rslt_hyng4;
		johhe_chk(a,dstin); 
		subj = "4a"; temp = spec_jjhyung.filter(isFind); 
		txd += "★★ " + rslt + " 자형 </br> ◐ " + temp[0][2] + "</br>"; 
		subj = rslt0.substr(0,2); temp = spec_jjhyung.filter(isFind);
		txd += "◐" + subj + " 자형--- " + temp[0][2] + "</br>"; 
		if (rslt0.length > 5 && rslt0.includes("자형")){
			subj = rslt0.substr(3,2); temp = spec_jjhyung.filter(isFind);
			txd += "◐" + subj + " 자형--- " + temp[0][2] + "</br>"; 
		};
		txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_jjhc += txd;}else{txt_jjhn += txd;};
		resolve();
	});
};

//====== 장간동요 ===================
function jjg_turb(){  
	//--- sj_gan: 천간4자, sj_dg+sj_dj: 일주
	//--- 지장간 일지: gj_nfo[3][9].substr(0,1), gj_nfo[3][10].substr(0,1), gj_nfo[3][11].substr(0,1)
	//--- 위치: pos_ch = "2": 월지,  "4": 시지,  "24": 원국투충, "": 행운충
	if (pos_ch.length == 0){pos_ch = "3";	};  //--- 행운충의 경우 일지의 지장간만 적용
	if ("辰戌丑未".includes(sj_dj)){  //--- 사고의 개
		sago();
	}else{  //--- 생왕개지
		gaeji();
	};
};

//====== 사고의 개 ===================
function sago(){   
	txd1 += "◐ 사고의 개---" + pos_ch + " </br>";
	for (j=0; j<pos_ch.length; j++){
		m = pos_ch.substr(j,1);
		for (i=0; i<3; i++){
			if (gj_nfo[m][i+9] == ""){continue;
			}else{
				sjj = gj_nfo[m][i+9].substr(0,1);
			};
			if (sj_gan.includes(sjj)){
				txt4go = gj_nfo[m][i+12] + "(" + sjj + ") 입고(십성) 흉";  //--- 지장간 기물이 천간에 있으면 입고(십성흉)
				if (txt2.substr(txt2.length-1) == "길"){txt4go += " ==> ★ 무난";};
			}else{
				dx = "甲己乙庚丙辛丁壬戊癸".indexOf(sjj);
				if(dx%2==1){sjg = "甲己乙庚丙辛丁壬戊癸".substr(dx-1,1);}else{sjg = "甲己乙庚丙辛丁壬戊癸".substr(dx+1,1);};
				if (sj_gan.includes(sjg)){
					sibsng(sj_dg,sjg,"");  //--- 지장간 기물이 천간에 없지만 합반합거(십성흉)
					txt4go = gs_titl + "(" + sjg + ") 합반합거(십성) 흉-- 누군가에 속음. 사기수";
					if (txt2.substr(txt2.length-1) == "길"){txt4go += " ==> ★ 무난";};
				}else{
					txt4go = gj_nfo[m][i+12] + "(" + sjj + ") 독야청청(십성) 길";  //--- 지장간 기물이 천간에 없고 독야청청(십성길)
				};
			};
			txd1 += "- " + txt4go + "</br>";
		};
	};
};

//====== 생왕개지 ===================
function gaeji(){   
	txd1 += "◐ 생왕개지---" + pos_ch + " </br>";
	for (j=0; j<pos_ch.length; j++){
		m = pos_ch.substr(j,1);
		if (gj_nfo[m][10] == ""){i=1;}else{i=0;};
		sjj = gj_nfo[m][i+10].substr(0,1);
		if (sj_gan.includes(sjj)){
			txt4go = gj_nfo[m][i+13] + "(" + sjj + ") 투간(십성) 길";  //--- 지장간 중(본)기 기물이 천간에 있으면 투간(십성길)
		}else{
			dx = "甲己乙庚丙辛丁壬戊癸".indexOf(sjj);
			if(dx%2==1){sjg = "甲己乙庚丙辛丁壬戊癸".substr(dx-1,1);}else{sjg = "甲己乙庚丙辛丁壬戊癸".substr(dx+1,1);};
			if (sj_gan.includes(sjg)){
				sibsng(sj_dg,sjg,"");  //--- 지장간 중(본)기 기물이 천간에 없지만 합반합거(십성흉)
				txt4go = gs_titl + "(" + sjg + ") 합반합거(십성) 흉-- 누군가에 속음. 사기수";
				if (txt2.substr(txt2.length-1) == "길"){txt4go += " ==> ★ 무난";};
			}else{
				txt4go = gj_nfo[m][i+13] + "(" + sjj + ") 독야청청.. 충발에 따른 흉";  //--- 지장간 기물이 천간에 없고 독야청청(십성흉)
				if (txt2.substr(txt2.length-1) == "길"){txt4go += " ==> ★ 무난";};
			};
		};
		txd1 += "- " + txt4go + "</br>";
	};
};

//====== gj_nfo, hgj_nfo, hun_list 테이블 작성 ====== mktable(1,hn_lg,hn_lj,hgj_nfo);
function mktable(a,b,c,fnm){
	subj = b; temp = gan.filter(isFind); fnm[a][2] = temp[0][4].substr(1,2); fnm[a][15] = temp[0][5]; 
	subj = c; temp = jiji.filter(isFind); fnm[a][6] = temp[0][4].substr(1,2);  fnm[a][15] += temp[0][5];
	fnm[a][9] = temp[0][6]; fnm[a][10] = temp[0][7]; fnm[a][11] = temp[0][8];
	sibsng(sj_dg,temp[0][6].substr(0,1),""); fnm[a][12] = gs_titl;
	sibsng(sj_dg,temp[0][7].substr(0,1),""); fnm[a][13] = gs_titl;
	sibsng(sj_dg,temp[0][8].substr(0,1),""); fnm[a][14] = gs_titl;
	sibsng(sj_dg,b,c); fnm[a][3] = gs_titl; fnm[a][7] = js_titl;
	unsng(sj_dg,c); fnm[a][8] = js_titl;
	hroo(b,c,a); fnm[a][4] = rt;
};

//====== 천간지지 십성 chk ======	
function sibsng(a,b,c){  //--- a: 기준, b: 천간, c: 지지
	gs_titl = ""; js_titl = "";
	idb = sibsungX1[0].lastIndexOf(a) - 1;
	if (b != ""){
		idx = sibsungX1[0].lastIndexOf(b);
		gs_titl = sibsungX1[idb][idx];  //--- (천간)십성 이름
	};
	if (c != ""){
		if (c == "辰" || c == "戌"){idx = sibsungX1[1].lastIndexOf("辰戌");
		}else{if (c == "丑" || c == "未"){idx = sibsungX1[1].lastIndexOf("丑未");
			}else{idx = sibsungX1[1].lastIndexOf(c);};};
		js_titl = sibsungX1[idb][idx];  //--- (지지)십성 이름
	};
};

//====== 십성으로 천간지지 찾기 ======	
function f_ganji(a,b,c){  //--- a: 기준천간, b: 천간십성, c: 지지십성
	g_titl = ""; j_titl = "";
	subj = a; tempg = sibsungX1.filter(isFind);
	if (b != ""){
		idx = tempg[0].lastIndexOf(b);
		g_titl = sibsungX1[0][idx];  //--- (천간)
	};
	if (c != ""){
		idy = tempg[0].lastIndexOf(c);
		j_titl = sibsungX1[1][idy];  //--- (지지)
	};
};

//======= 십이운성 기록하는 함수 =====
function unsng(a,b){
	idb = sibsungX1[0].lastIndexOf(a) - 1;	
	idx = unsung[idb].lastIndexOf(b);
	js_titl = unsung[0][idx];
};
	
//====== 천간합 자기자리 통근체크 함수 ======
//---- hroo(천간,지지,c); --- c: 시주이면 4(예외적용)..
function hroo(a,b,c){  
	hro = ""; rt = "";
	sibsng(a,"",b);
	hro = js_titl;  //--- 십성
	if (hro === "비견" || hro === "겁재" || hro === "편인" || hro === "정인"){	rt = "1" + hro; }else{ rt = "0" + hro;};  //--- 통근1불통근0 + 십성
	if (c==4){  //--- 예외 적용 (甲일간 己巳시,乙일간 庚辰시,戊일간 癸亥시,癸일간 戊午시는 불통근으로 간주함.)
		if ((sj_dg == "甲" && sj_tg == "己" && sj_tj == "巳") || (sj_dg == "乙" && sj_tg == "庚" && sj_tj == "辰") || (sj_dg == "戊" && sj_tg == "癸" && sj_tj == "亥") || (sj_dg == "癸" && sj_tg == "戊" && sj_tj == "午")){	rt = "0" + hro;};  //--- 불통근 + 십성
	};
};

//---- 통근체크 ----
function ganji_root(){
	//------ 모든 천간의 통근 확인 -----------
	document.getElementById("output2").innerText += "(위치가중: 10 7 4 1 월지13 일지12 기본10) \n";
	subj = sj_yg; temp = sibsungX1.filter(isFind); root_point("년간",temp[0],"비견","겁재","편인","정인","output2");
	subj = sj_mg; temp = sibsungX1.filter(isFind); root_point("월간",temp[0],"비견","겁재","편인","정인","output2");
	subj = sj_dg; temp = sibsungX1.filter(isFind); root_point("일간",temp[0],"비견","겁재","편인","정인","output2");
	if (sjtx != "x"){ subj = sj_tg; temp = sibsungX1.filter(isFind); root_point("시간",temp[0],"비견","겁재","편인","정인","output2");};
	document.getElementById("output2").innerText += "\n";
};

//========== 천간의 통근을 확인하는 함수 ==========
function root_point(a,b,c,d,e,f,g) {
	tit = ""; cfm = ""; eff1 = 0; eff2 = 0; eff3 = 0; eff4 = 0; eff0 = 0;
	efft = 0; isol = "";
		idx = b.lastIndexOf(c); tit += sibsungX1[0][idx];
		idx = b.lastIndexOf(d); tit += sibsungX1[0][idx];
		idx = b.lastIndexOf(e); tit += sibsungX1[0][idx];
		idx = b.lastIndexOf(f); tit += sibsungX1[0][idx];	
	for (i=1;i<5 ; i++){
		if (tit.includes(gj_nfo[i][11].substr(0,1))==true){document.getElementById(g).innerText += i + ".... 지장간 " + gj_nfo[i][11] + "\n"; cfm += "kj"; eval('eff' + i + ' += Number(gj_nfo[i][11].substr(1,2))');};
		if (gj_nfo[i][10] != "" && tit.includes(gj_nfo[i][10].substr(0,1))==true){document.getElementById(g).innerText += i + ".... 지장간b " + gj_nfo[i][10] + "\n"; cfm += "kj"; eval('eff' + i + ' += Number(gj_nfo[i][10].substr(1,2))');};
		if (tit.includes(gj_nfo[i][9].substr(0,1))==true){document.getElementById(g).innerText += i + ".... 지장간a " + gj_nfo[i][9] + "\n"; cfm += "kj"; eval('eff' + i + ' += Number(gj_nfo[i][9].substr(1,2))');};
	};
	if (a == "년간"){eff0 = (eff1 * 100) + (eff2 *13 * 7) + (eff3 * 12 * 4) + (eff4 * 10);};
	if (a == "월간"){eff0 = (eff2 * 130) + (eff3 *12 * 7) + (eff4 * 40) + (eff1 * 70);};
	if (a == "일간"){eff0 = (eff3 * 120) + (eff2 *13 * 7) + (eff4 * 70) + (eff1 * 40);};
	if (a == "시간"){eff0 = (eff4 * 100) + (eff3 *12 * 7) + (eff2 * 13 * 4) + (eff1 * 10);};
	efft = parseInt(eff0 / 30);
	if (efft > 119){ ganf = "극강";
	}else{if (efft > 89){ ganf = "강";
		}else{if (efft > 59){ ganf = "중";
			}else{if (efft > 29){ ganf = "약";
				}else{ganf = "극약";}}};};
	if (a == "년간"){ 
		ganf1 = ganf; 
		if (ganf1 != "극약" || tit.includes(sj_mg)){
			isol_y = "";
		}else{isol_y = "고립"; isol = "고립";};
	};		
	if (a == "월간"){ 
		ganf2 = ganf;
		if (ganf2 != "극약" || tit.includes(sj_dg) || tit.includes(sj_yg)){
			isol_m = "";
		}else{isol_m = "고립"; isol = "고립";};
	};		
	if (a == "일간"){ 
		ganf3 = ganf 
		if (ganf3 != "극약" || tit.includes(sj_mg) || tit.includes(sj_tg)){
			isol_d = "";
		}else{isol_d = "고립"; isol = "고립";};
	};		
	if (a == "시간"){ 
		ganf4 = ganf 
		if (ganf4 != "극약" || tit.includes(sj_dg)){
			isol_t = "";
		}else{isol_t = "고립"; isol = "고립";};
	};		
	document.getElementById("output2").innerText += ".............................." + a + " " + b[0] + " 통근 " + ganf + isol + " ..... " + String(efft) + "%\n";
};	
	
//========== 지지의 투간을 확인하는 함수 ==========
function tugan(){
	sj_gan = sj_yg + sj_mg + sj_dg + sj_tg; 
	sj_ji = sj_yj + sj_mj + sj_dj + sj_tj; 
	sj_ganji = sj_yg + sj_yj + sj_mg + sj_mj + sj_dg + sj_dj + sj_tg + sj_tj;
	jjg = ""; eff0 = 0; pos = "";idx = 0; n = 0; ttx = ""; nfo_tugan = "";
	subj = sj_dg; temp = sibsungX1.filter(isFind);
	for (i=1; i<5; i++){
		for (j=0; j<3; j++){
			jjg = gj_nfo[i][j+9].substr(0,1);  //--- 지장간
			if (jjg != ""){
				eff = Number(gj_nfo[i][j+9].substr(1,2));  //---지장간 비율
				eff0 = 0; pos = "";
				if (sj_gan.includes(jjg)){
					n = 0;
					while (true){
						idx = sj_gan.indexOf(jjg,n)  //--- 투간된 위치
						if(idx == -1){break;};		
						pos += String(idx+1);
						eff0 += parseInt(eff/30 *(100-Math.abs(idx+1-i)*30));
						n = idx + 1;
					};
					if (i == 1){ttx = "년지";
					}else{	if (i == 2){ttx = "월지"; idx = sibsungX1[0].lastIndexOf(jjg); nfo_tugan = "■ 격국용신... 월지투간==> " + temp[0][idx] + "格 "+ jjg + "..용신"; yongsin[1][1] = temp[0][idx] + "格"; yongsin[2][1] = jjg; 
						}else{	if (i == 3){ttx = "일지";
							}else{	if (i == 4){ttx = "시지";}}}};
					document.getElementById("output2").innerText += String(i) + ".... 지장간 " + jjg + eff + "..........." + ttx +" .... " + pos + " 투간... " + eff0 + "%\n";
				};	
			};
		};
	};
};
	
//========== 오행의 갯수 check 하는 함수 ==========
function mpohcnt(){
	let sp1 = (ohtx.match(/양목/g) || []).length; 
	let sp2 = (ohtx.match(/양화/g) || []).length;
	let sp3 = (ohtx.match(/양토/g) || []).length;
	let sp4 = (ohtx.match(/양금/g) || []).length;
	let sp5 = (ohtx.match(/양수/g) || []).length;
	let sm1 = (ohtx.match(/음목/g) || []).length;
	let sm2 = (ohtx.match(/음화/g) || []).length;
	let sm3 = (ohtx.match(/음토/g) || []).length;
	let sm4 = (ohtx.match(/음금/g) || []).length;
	let sm5 = (ohtx.match(/음수/g) || []).length;
	let nc = 0;
	if (gj_nfo[3][2].substr(1,1)=="목")	{nc=5;}; if (gj_nfo[3][2].substr(1,1)=="화"){nc=4;}; if (gj_nfo[3][2].substr(1,1)=="토"){nc=3;}; 
	if (gj_nfo[3][2].substr(1,1)=="금")	{nc=2;}; if (gj_nfo[3][2].substr(1,1)=="수"){nc=1;}; 
	for (i=1; i<6; i++){
		ncx = nc + i;
		if (ncx>9){ ncx=ncx-5; }else{ if (ncx<5){ ncx=ncx+5;}};
		if (i==1){balance[1][ncx] = "목" + String(sp1+sm1);};
		if (i==2){balance[1][ncx] = "화" + String(sp2+sm2);};
		if (i==3){balance[1][ncx] = "토" + String(sp3+sm3);};
		if (i==4){balance[1][ncx] = "금" + String(sp4+sm4);};
		if (i==5){balance[1][ncx] = "수" + String(sp5+sm5);};
	};
	document.getElementById("output2").innerText += "오행...양...음\n";
	document.getElementById("output2").innerText += "...목......" + String(sp1) + "......" + String(sm1) + "\n";
	document.getElementById("output2").innerText += "...화......" + String(sp2) + "......" + String(sm2) + "\n";
	document.getElementById("output2").innerText += "...토......" + String(sp3) + "......" + String(sm3) + "\n";
	document.getElementById("output2").innerText += "...금......" + String(sp4) + "......" + String(sm4) + "\n";
	document.getElementById("output2").innerText += "...수......" + String(sp5) + "......" + String(sm5) + "\n";
	document.getElementById("output2").innerText += "\n";

	let sstx = gj_nfo[1][3] + gj_nfo[1][7] + gj_nfo[2][3] + gj_nfo[2][7] + gj_nfo[3][3] + gj_nfo[3][7] + gj_nfo[4][3] + gj_nfo[4][7];
	document.getElementById("output2").innerText += "...편인......" + (sstx.match(/편인/g) || []).length + "......" + (sstx.match(/정인/g) || []).length + "......정인 \n";
	document.getElementById("output2").innerText += "...비견......" + (sstx.match(/비견/g) || []).length + "......" + (sstx.match(/겁재/g) || []).length + "......겁재 \n";
	document.getElementById("output2").innerText += "...식신......" + (sstx.match(/식신/g) || []).length + "......" + (sstx.match(/상관/g) || []).length + "......상관 \n";
	document.getElementById("output2").innerText += "...편재......" + (sstx.match(/편재/g) || []).length + "......" + (sstx.match(/정재/g) || []).length + "......정재 \n";
	document.getElementById("output2").innerText += "...편관......" + (sstx.match(/편관/g) || []).length + "......" + (sstx.match(/정관/g) || []).length + "......정관 \n";
	document.getElementById("output2").innerText += "\n";
};

//========= 지지방합 check 하는 함수 ========
function banghab(){

};	

//========= 지지삼합 check 하는 함수 ========
function samhab(){

};	





//=========== 일간의 통근 상황 확인===========
function rootgchk(){
	pointr = ""; 
	document.getElementById("output2").innerText += "\n";
	dgroot(gj_nfo[3][7],1);  //----- 일지 = 인성/비겁 여부 -----
	dgroot(gj_nfo[2][7],2);  //----- 월지 = 인성/비겁 여부 -----
	pwrcnt();  //----- 일간의 세력상태 확인 -----
	
	pn = pointr.match(/Y/g);
	pn1 = pointr.match(/N/g);
	if(pn != null) {
		if(pn.length === 3){
			document.getElementById("output2").innerText += "극신강 사주 ..." + pointr + "\n"; balance[1][4] = "극신강";
		}else{
			if(pn.length === 2){
				document.getElementById("output2").innerText += "신강 사주 ..." + pointr + "\n"; balance[1][4] = "신강";
			}else{
				if(pn.length === 1){
					document.getElementById("output2").innerText += "신약 사주 ..." + pointr + "\n"; balance[1][4] = "신약";}}};
	}else{document.getElementById("output2").innerText += "극신약 사주 ..." + pointr + "\n"; balance[1][4] = "극신약";};

	if (nfo_tugan != ""){document.getElementById("output2").innerText += nfo_tugan + "\n\n";
	}else{	sibsng(sj_dg,"",sj_mj); document.getElementById("output2").innerText += "사주격국 (기본) " + js_titl + "格 " + "\n\n";};

	//--- output1에 추가 display (격국용신)
	if(pn != null) {
		if(pn.length === 3){
			document.getElementById("output1").innerText += "■ 극신강 사주 ..." + pointr + "\n";
		}else{
			if(pn.length === 2){
				document.getElementById("output1").innerText += "■ 신강 사주 ..." + pointr + "\n";
			}else{
				if(pn.length === 1){
					document.getElementById("output1").innerText += "■ 신약 사주 ..." + pointr + "\n";}}};
	}else{document.getElementById("output1").innerText += "■ 극신약 사주 ..." + pointr + "\n";};

	//--- output1에 추가 display (조후용신)
	johu();
	document.getElementById("output1").innerText += "■ 조후용신 ..." + johu_ys + " 희신: " + johu_hs + "\n";
	yongsin[2][3] = johu_ys; yongsin[3][3] = johu_hs;
	if (nfo_tugan != ""){document.getElementById("output1").innerText += nfo_tugan + "\n\n";
	}else{	sibsng(sj_dg,"",sj_mj); document.getElementById("output1").innerText += "사주격국 (기본) " + js_titl + "格 " + "\n\n";};
//	yong0();
//	yong1();
//	yong2();
};	

//========= 조후용신 check 하는 함수 ========
function johu(){
	subj = sj_dg; temp = ysin_johu.filter(isFind);
	idx = ysin_johu[0].lastIndexOf(sj_mj);
	johu_ys = temp[0][idx];
	johu_hs = temp[1][idx];
};	

//========= 종격용신법 check 하는 함수 ========
function yong0(){
	let n_sjg = ""; let n_ib = "";
	n_sjg = balance[1][7].substr(1,1) + balance[1][8].substr(1,1) + balance[1][9].substr(1,1);
	n_ib = balance[1][5].substr(1,1) + balance[1][6].substr(1,1);

	if (n_sjg=="000" && (gj_nfo[2][7]=="비견" || gj_nfo[2][7]=="겁재") && balance[1][6].substr(1,1)>"5"){	
		yongsin[1][6] = "종왕格"; yongsin[2][6] = "비겁"; yongsin[3][6] = "인성"; 
	};
	if (n_sjg=="000" && (gj_nfo[2][7]=="편인" || gj_nfo[2][7]=="정인") && balance[1][5].substr(1,1)>"5"){	
		yongsin[1][6] = "종강格"; yongsin[2][6] = "인성"; yongsin[3][6] = "비겁"; 
	};
	if (n_ib=="00" && (gj_nfo[2][7]=="식신" || gj_nfo[2][7]=="상관") && balance[1][7].substr(1,1)>"3"){	
		yongsin[1][6] = "종아格"; yongsin[2][6] = "식상"; yongsin[3][6] = "재성"; 
	};
	if (n_ib=="00" && (gj_nfo[2][7]=="편재" || gj_nfo[2][7]=="정재") && balance[1][8].substr(1,1)>"3"){	
		yongsin[1][6] = "종재格"; yongsin[2][6] = "재성"; yongsin[3][6] = "식상"; 
	};
	let sstx = gj_nfo[1][3] + gj_nfo[1][7] + gj_nfo[2][3] + gj_nfo[2][7] + gj_nfo[3][3] + gj_nfo[3][7] + gj_nfo[4][3] + gj_nfo[4][7];
	if (n_ib=="00" && (gj_nfo[2][7]=="편관" || gj_nfo[2][7]=="정관") && balance[1][9].substr(1,1)>"3" && (sstx.match(/상관/g) || []).length==0){	
		yongsin[1][6] = "종관格"; yongsin[2][6] = "관성"; yongsin[3][6] = "재성"; 
	};
};	

//========= 일행격용신법 check 하는 함수 ========
function yong1(){


};

//========= 이행격용신법 check 하는 함수 ========
function yong2(){


};





//========= 일간의 통근 check 하는 함수 ========
function dgroot(pos,a){
	pass = ""; fail = "";
	if (pos === "정인" || pos === "편인" || pos === "비견" || pos === "겁재"){ 
		if (a === 1){ pointr = pointr + "득지Y"; pass = "득지\n"; balance[1][1] = "득지";
		}else{if (a === 2){ pointr = pointr + "득령Y"; pass = "득령\n"; balance[1][2] = "득령";}else{pass = pos + " 통근\n";}};
		document.getElementById("output2").innerText += "일간 " + pass;
	}else{
		if (a === 1){ pointr = pointr + "실지N"; fail = "실지\n"; balance[1][1] = "실지";
		}else{if (a === 2){ pointr = pointr + "실령N"; fail = "실령\n"; balance[1][2] = "실령";}else{ fail = " ";}};
		document.getElementById("output2").innerText += fail;};
};
	
//========= 일간의 세력 check 하는 함수 =========
function pwrcnt(){
	sstext = gj_nfo[1][3] + "_" + gj_nfo[1][7] + "_" + gj_nfo[2][3] + "_" + gj_nfo[2][7] + "_" + gj_nfo[3][7] + "_" + gj_nfo[4][3] + "_" + gj_nfo[4][7];  //--- 십성
	let r1 = (sstext.match(/비견/g) || []).length;
	let r2 = (sstext.match(/겁재/g) || []).length;
	let r3 = (sstext.match(/편인/g) || []).length;
	let r4 = (sstext.match(/정인/g) || []).length;

	r0 = r1 + r2 + r3 + r4;
	if (r0 > 3){
		pointr = pointr + "득세Y"; balance[1][3] = "득세";
		document.getElementById("output2").innerText += "일간 득세 " + String(r0) + " / " + String(7-r0) + "\n\n";
	}else{
		pointr = pointr + "실세N"; balance[1][3] = "실세";
		document.getElementById("output2").innerText += "일간 실세 " + String(r0) + " / " + String(7-r0) + "\n\n";};
};

//======= 대운수 & 초기대운일 ======
function longun(){
	longungj = ""; 
	if (gj_nfo[1][2].substr(0,1) === gendr.substr(1,1)){
		perio = (postmon - birth1) / term * 10 * 365;
		r = 1;
	}else{
		perio = (birth1 - premon) / term * 10 * 365;
		r = -1;
	};
	firstD = new Date(symdt.substr(0,16));  //--- 초기대운일 
	firstD.setTime(firstD.getTime() + perio);  //--- 초기대운일 계산	
	age = firstD.getFullYear() - birth0.getFullYear() + 1;  //--- 대운수(나이)
	firstD = new Date(firstD); firstD1 = new Date(firstD.format('yyyy-MM-dd HH:mm'));
	slr2lnr(birth0);
	document.getElementById("output2").innerText += "생년월일 : " + birth0.format('yyyy-MM-dd HH:mm') + " (" + (now.getFullYear() - birth0.getFullYear() + 1) + "세 " + gendr.substr(0,1) + "성) \n";
	document.getElementById("output2").innerText += " (음 력) : " + lnrd + " \n";
	document.getElementById("output2").innerText += "초기대운일 (" + age + "세) " + firstD.format('yyyy-MM-dd HH:mm') + " \n\n";
	due = firstD;
	for (i=0; i<gan.length; i++){
		if (gan[i][0] === sj_mg){a = i};
	};
	for (i=0; i<jiji.length; i++){
		if (jiji[i][0] === sj_mj){b = i};
	};
	
	for (i=1; i<15; i++){
		ca = (a + i * r + 59) % 10 + 1;
		cb = (b + i * r + 59) % 12 + 1;
		posa = "sjua" + i; posb = "sjub" + i;
		longungj += gan[ca][0] + jiji[cb][0];
		if (i==1){
			hun_list[i][15] = firstD1.format('yyyy-MM-dd HH:mm');
		}else{
			firstD1.setFullYear(firstD1.getFullYear() + 10); 
			hun_list[i][15] = firstD1.format('yyyy-MM-dd HH:mm');
		};
		hun_list[i][1] = gan[ca][0]; hun_list[i][2] = gan[ca][4].substr(1,2); hun_list[i][5] = jiji[cb][0]; hun_list[i][6] = jiji[cb][4].substr(1,2);  //--- 대운 테이블(hun_list) 생성
		hun_list[i][9] = jiji[cb][6]; hun_list[i][10] = jiji[cb][7]; hun_list[i][11] = jiji[cb][8];
		sibsng(sj_dg,jiji[cb][6].substr(0,1),""); hun_list[i][12] = gs_titl; 
		sibsng(sj_dg,jiji[cb][8].substr(0,1),""); hun_list[i][14] = gs_titl;
		if (jiji[cb][7] == ""){	hun_list[i][13] = ""}else{sibsng(sj_dg,jiji[cb][7].substr(0,1),""); hun_list[i][13] = gs_titl;}; 
		hroo(gan[ca][0],jiji[cb][0],0); hun_list[i][4] = rt;
		unsng(sj_dg,jiji[cb][0]); hun_list[i][8] = js_titl;
		
		sibsng(sj_dg,gan[ca][0],jiji[cb][0]); hun_list[i][3] = gs_titl; hun_list[i][7] = js_titl; 
		if (i < 11){
			document.getElementById(posb).innerText += "(" + (age + (i - 1) * 10) + ")" + "\n";
			document.getElementById(posa).innerText += gan[ca][0] + "\n";
			document.getElementById(posb).innerText += hun_list[i][3] + "\n" + hun_list[i][2] + " \n\n";
			document.getElementById(posa).innerText += jiji[cb][0] + "\n";
			document.getElementById(posb).innerText += hun_list[i][7] + "\n" + hun_list[i][6] + " \n " + hun_list[i][8] + " \n";
		};
	};
};
	
//====== 연운 ======
function seun(){
	vwyr = null; rvwyr = null; seug = ""; seugs = ""; seugoh = ""; seuj = ""; seujs = ""; seujoh = "";
	rvwyr = birth1.getFullYear() + age - 1;
	subj = sj_dg; temp = sibsungX1.filter(isFind); temp1 = unsung.filter(isFind);  //---십성(일간)
	k = 1; j = 0;
	for (i=0; i<150; i++){
		vwyr = rvwyr + i;
		mo = (vwyr - 1863) % 10; 
		no = (vwyr - 1863) % 12;
		if (mo === 0){ mo = 10; };
		if (no === 0){ no = 12; };
		if (j == 10){
			k += 1;
			j = 0
		};
		if (k < 11){
			posi = "seu" + k;
		}else{
			posi = "";
		};
		seug = gan[mo][0]; 
		seugoh = gan[mo][4].substr(1,2);
		idx = sibsungX1[0].lastIndexOf(seug);
		seugs = temp[0][idx];  //--- (천간)십성 이름
		if (posi != ""){		
			document.getElementById(posi).innerText += vwyr + " (" + (vwyr - birth1.getFullYear() + 1) + ")\n";
			document.getElementById(posi).innerText += seug + seugs + seugoh + "\n";
		};
		seuj = jiji[no][0];
		seujoh = jiji[no][4].substr(1,2);
		if (seuj == "辰" || seuj == "戌"){idx = sibsungX1[1].lastIndexOf("辰戌");
		}else{if (seuj == "丑" || seuj == "未"){idx = sibsungX1[1].lastIndexOf("丑未");
			}else{idx = sibsungX1[1].lastIndexOf(seuj);};};
		seujs = temp[0][idx];  //--- (지지)십성 이름
		iuns = temp1[0].lastIndexOf(seuj);
		seuns = unsung[0][iuns]; if (seuns.length>1){seuns = seuns.substr(1);};
		if (posi != ""){
			document.getElementById(posi).innerText += seuj + seujs + seujoh + " " + seuns + "\n";
			if ((i%10) != 9){document.getElementById(posi).innerText += "--------------\n";};
		};
		j += 1;
	};
};
	
//====== 월운 ======
function moun(){
	subj = sj_dg; temp = sibsungX1.filter(isFind); temp1 = unsung.filter(isFind);  //---십성(일간)
	for (i=0; i<12; i++){
		n = i - 3;
		posi = "mou" + ((n + 3) % 3 + 1);
 		mountit = new Date(now.setMonth(now.getMonth() + n));
		
		mothg = ((mountit.getFullYear() - 1909) * 12 + mountit.getMonth() + 1) % 10 + 1;  //--- 1908.12 (무신 갑자) 이후 월간
		if (mothg == 0){mothg = 10;};
		mothj = ((mountit.getFullYear() - 1909) * 12 + mountit.getMonth() + 1) % 12 + 1;  //--- 1908.12 (무신 갑자) 이후 월지
		if (mothj == 0){mothj = 12;};
 		moung = gan[mothg][0];
 		moungoh = gan[mothg][4].substr(1,2);  //--- (천간)음양오행
 		idx = sibsungX1[0].lastIndexOf(moung);
 		moungs = temp[0][idx];  //--- (천간)십성 이름
		
		mounj = jiji[mothj][0];
		mounjoh = jiji[mothj][4].substr(1,2);
		if (mounj == "辰" || mounj == "戌"){idx = sibsungX1[1].lastIndexOf("辰戌");
		}else{if (mounj == "丑" || mounj == "未"){idx = sibsungX1[1].lastIndexOf("丑未");
			}else{idx = sibsungX1[1].lastIndexOf(mounj);};};
		mounjs = temp[0][idx];  //--- (지지)십성 이름
		iuns = temp1[0].lastIndexOf(mounj);
		mouns = unsung[0][iuns]; if (mouns.length>1){mouns = mouns.substr(1);};
		document.getElementById(posi).innerText += mountit.format('yyyy-MM') + " (" + mounj + ")\n";
 		document.getElementById(posi).innerText += moung + moungs + moungoh + "\n";
 		document.getElementById(posi).innerText += mounj + mounjs + mounjoh + " " + mouns + "\n";
		if (i < 9){document.getElementById(posi).innerText += "--------------\n";};
	};
};

//====== 일운 ======
function dayun(){
	subj = sj_dg; temp = sibsungX1.filter(isFind); temp1 = unsung.filter(isFind); now = now; //---십성(일간)
	for (i=0; i<28; i++){
 		dauntit = new Date(now.setDate(now.getDate() + i - 3));
		posi = "dau" + (i % 7 + 1);
		daysg = Math.ceil((dauntit.getTime() - new Date('1908-01-10').getTime()) / 86400000) % 10;
		if (daysg == 0){daysg = 10};
		daysj = Math.ceil((dauntit.getTime() - new Date('1908-01-10').getTime()) / 86400000) % 12;
		if (daysj == 0){daysj = 12};
		daung = gan[daysg][0];
		daungoh = gan[daysg][4].substr(1,2);  //--- (천간)음양오행
		idx = sibsungX1[0].lastIndexOf(daung);
		daungs = temp[0][idx];  //--- (천간)십성 이름

		daunj = jiji[daysj][0];
		daunjoh = jiji[daysj][4].substr(1,2);
		if (daunj == "辰" || daunj == "戌"){idx = sibsungX1[1].lastIndexOf("辰戌");
		}else{if (daunj == "丑" || daunj == "未"){idx = sibsungX1[1].lastIndexOf("丑未");
			}else{idx = sibsungX1[1].lastIndexOf(daunj);};};
		daunjs = temp[0][idx];  //--- (지지)십성 이름
		iuns = temp1[0].lastIndexOf(daunj);
		dauns = unsung[0][iuns]; if (dauns.length>1){dauns = dauns.substr(1);};
		document.getElementById(posi).innerText += dauntit.format('yyyy-MM-dd') + "\n";
 		document.getElementById(posi).innerText += daung + daungs + daungoh + "\n";
 		document.getElementById(posi).innerText += daunj + daunjs + daunjoh + " " + dauns + "\n";
		if (i < 21){document.getElementById(posi).innerText += "--------------\n";};
	};
};
	
//======= 화면양식에 사주내용 기록하는 함수 =====
function fill_saju(){
	ohtx = "";
	for (i=1;i<5 ; i++){
		m = i * 2 -1;
		n = i * 2;
		document.getElementById("sj" + m).innerText += gj_nfo[i][1];  //--- 천간 기록
		document.getElementById("sjg" + m).innerText += gj_nfo[i][2];  //--- 천간 음양오행 기록
		chg_bgcolor("#sj" + m,gj_nfo[i][15].substr(0,4),gj_nfo[i][15].substr(0,4));  //--- 천간 배경색
		document.getElementById("sj" + n).innerText += gj_nfo[i][5];  //--- 지지 기록
		document.getElementById("sjg" + n).innerText += gj_nfo[i][6];  //--- 지지 음양오행 기록
		chg_bgcolor("#sj" + n,gj_nfo[i][15].substr(4,4),gj_nfo[i][15].substr(4,4));  //--- 지지 배경색
		ohtx += gj_nfo[i][2] + gj_nfo[i][6]; 

		//--- 지장간 기록 ---
		document.getElementById("sj" + n + "b").innerText += gj_nfo[i][9] + " " + gj_nfo[i][12]  + "\n";
		if (gj_nfo[i][10] == ""){
			document.getElementById("sj" + n + "b").innerText += " \n";
		}else{
			document.getElementById("sj" + n + "b").innerText += gj_nfo[i][10] + " " + gj_nfo[i][13] + "\n";
		};
		document.getElementById("sj" + n + "b").innerText += gj_nfo[i][11] + " " + gj_nfo[i][14] + "\n";
	}
	document.getElementById("sj1a").innerText += gj_nfo[1][3] + "\n"; document.getElementById("sj2a").innerText += gj_nfo[1][7] + "\n";  //--- 년주 십성 기록
	document.getElementById("sj3a").innerText += gj_nfo[2][3] + "\n"; document.getElementById("sj4a").innerText += gj_nfo[2][7] + "\n";  //--- 월주 십성 기록
	document.getElementById("sj5a").innerText += "일간(나)\n"; document.getElementById("sj6a").innerText += gj_nfo[3][7] + "\n";  //--- 일주 십성 기록
	document.getElementById("sj7a").innerText += gj_nfo[4][3] + "\n"; document.getElementById("sj8a").innerText += gj_nfo[4][7] + "\n";  //--- 시주 십성 기록
	document.getElementById("sj2c").innerText += "(일간) " + gj_nfo[1][8] + " \n";  //----- 년지 십이운성 기록
	document.getElementById("sj4c").innerText += "(일간) " + gj_nfo[2][8] + " \n";  //----- 월지 십이운성 기록
	document.getElementById("sj6c").innerText += "(일간) " + gj_nfo[3][8] + " \n";  //----- 일지 십이운성 기록
	document.getElementById("sj8c").innerText += "(일간) " + gj_nfo[4][8] + " \n";  //----- 시지 십이운성 기록
};

//====== 천간합충 원국/행운 결과 출력 함수 ======
//--- result_out(code2, desc, "원국", "output1");
function result_out(tx,desc,sts,dstin){
	if (tx != "-"){
		txd = ""; cssn4 += 1; 
		txd += '■ <span class = "spcs css_gw' + cssn4 + '">일간 ' + hcg3 + " " + sts + "--- " + desc + '</span></br><div id = "css_gw' + cssn4 + '" class = "txca">';
		if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
//		if (sts.includes("실행")){
			if (tx == "1"){summing1(dstin);};  //--- 합(1)
			if (tx == "2"){summing2(dstin); summing1(dstin); };  //--- 합화 용신(2)
			if (tx == "3"){summing3(dstin);};  //--- 불합(3)
			if (tx == "4"){summing4(dstin);};  //--- 합봉(4) 
			if (tx == "5"){summing5(dstin);};  //--- 용봉(5) 
			if (tx == "6"){summing3(dstin); summing6(dstin, sts);};  //--- 합파불합(6)
			if (tx == "7"){summing3(dstin); summing8(dstin);};  //--- 불합+충(7)
			if (tx == "8"){summing8(dstin);};  //--- 충발(8) 
			if (tx == "9"){summing3(dstin); summing6(dstin, sts); summing8(dstin);};  //--- 합파충(9) 
			if (tx == "b"){summingb(dstin);};  //--- 충거(b) 
//		};
		txd = ""; txd += "</div>--------------------------------------------------------------</br>";
		if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
	};
};

//======== 합(1) 내용 summary ========
function summing1(dstin){
	subj = sj_dg; temp = cgh02_dhap_simrihealth.filter(isFind); sz = ""; txd = "";
	if (ganhc_nfo[3][4].includes(temp[0][8])){sz = "심리(20~38세)---";};
	if (ganhc_nfo[3][5].includes(temp[0][8])){sz = "심리(58세~)---";};
	//--- 정재/정관의 긍정심리
	subj = temp[0][4].substr(3,2);
	for (j=1; j< cgh01_sibsng_simri6chin.length; j++){
		if (cgh01_sibsng_simri6chin[j][0] == subj){
			rslt = cgh01_sibsng_simri6chin[j][1]; 
			txd += "◐ " + subj + sz + rslt + "</br>";
		};
	};
	txd += "◐ 일간의 심리--- 1.다정다감 2.부화뇌동 3.부정망상</br>" + temp[0][5] + " " + temp[0][7] + "</br> 배우자 이상형---" + temp[0][6] + "</br>";
	if (temp[0][9].includes(sj_dg)){ sts = "총명하여 학술과 기예에 관심이 많고, 또 양순하면서도 다정다감하여 대인관계가 원만한 편이다. 하지만 이성으로부터 많은 관심을 받거나 부화뇌동(附和雷同)하려는 심리가 강해 자칫하면 구설에 휘말릴 수 있다.";};  //--- 합화생
	if (temp[0][10].includes(sj_dg)){ sts = "신강하면 흉화가 없지만 신약하면 소심박약(小心薄弱)하고 편향성(偏向性)을 띠게 된다";};  //--- 합화극
	txd += sts + "</br> 건강에 주의---" + temp[0][12] + "</br>";
	if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
};

//======== 합화(2) 내용 summary ========
function summing2(dstin){  //--- 극의 유무를 확인
	n = 0; subj = sj_dg; temp = cgh02_dhap_simrihealth.filter(isFind); txd = "";
	for (k = 2; k < sibsungX1.length; k++){
		if (sibsungX1[k][2].substr(1,1) == temp[0][2]){  //--- 금(일간오행)==금(합화오행)  k=8,9
			idx = sibsungX1[k].indexOf('편관');  //--- (8-5), (9-6)
			rslt += sibsungX1[0][idx] + sibsungX1[1][idx];  //--- 丙巳, 丁午
			idx = sibsungX1[k].indexOf('정관');  //--- (8-6), (9-5)
			rslt += sibsungX1[0][idx] + sibsungX1[1][idx];  //--- 丙巳+丁午, 丁午+丙巳 (중복됨) 극에 해당하는 간지
		};
	};
	if (rslt.includes(sj_yg)){ n += 1;}else{ n += 0;}; if (rslt.includes(sj_yj)){ n += 1;}else{ n += 0;};	  //--- 연간 연지 극여부
	if (rslt.includes(sj_dj)){ n += 1;}else{ n += 0;}; if (rslt.includes(sj_tj)){ n += 1;}else{ n += 0;};	  //--- 일지 시지 극여부
	if (hcg3.substr(0,1) == "합"){ if (rslt.includes(sj_tg)){ n += 1;}else{ n += 0;};};  //--- 일월간합에 시간의 극여부
	if (hcg3.substr(2,1) == "합"){ if (rslt.includes(sj_mg)){ n += 1;}else{ n += 0;};};	 //--- 일시간합에 월간의 극여부
	if (n == 0){txd += "◐ " + desc.substr(0,3) + "합화격 " + temp[0][2] + "오행 용신</br>"; 
		yongsin[1][9] = desc.substr(0,3); yongsin[2][9] = temp[0][2]; yongsin[3][9] = temp[0][3];
	}else{txd += " + 합오행을 극함</br>◐ 성합불화 ";};
	if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
};
	
//======== 불합(3) 내용 summary ========
function summing3(dstin){
	subj = sj_dg; temp = cgh02_dhap_simrihealth.filter(isFind); sz = ""; txd = "";
	if (ganhc_nfo[3][4].includes(temp[0][8])){sz = "심리(20~38세)---";};
	if (ganhc_nfo[3][5].includes(temp[0][8])){sz = "심리(58세~)---";};
	subj = temp[0][4].substr(3,2);
	for (j=1; j< cgh01_sibsng_simri6chin.length; j++){
		if (cgh01_sibsng_simri6chin[j][0] == subj){
			rslt = cgh01_sibsng_simri6chin[j][2]; 
			txd += "◐ " + subj + sz + rslt + "</br>";
		};
	};
	if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
};
	
//======== 합봉(4) 내용 summary ========
function summing4(dstin){
	subj = sj_dg; temp = cgh02_dhap_simrihealth.filter(isFind); txd = "";
	txd += "◐ 건강 흉화 " + temp[0][12] + "</br>";
	subj = temp[0][4].substr(3,2);
	temp = cgh01_sibsng_simri6chin.filter(isFind);
	if (gendr == "남양"){n = 1;}else{n = 2;};
	txd += "(" + temp[0][n+2] + ") 흉화--- </br>";
	txd += temp[0][2] + "손재수 노다공소</br>";
	if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
};
	
//======== 용봉(5) 내용 summary ========
function summing5(dstin){
	subj = sj_dg; temp = cgh02_dhap_simrihealth.filter(isFind); txd = "";
	txd += "◐ " + temp[0][4].substr(3,2) + "운 " + temp[0][5].substr(0,2) + "운 흉화 </br>";
	txd += "건강 흉화 " + temp[0][12] + "</br>";
	if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
};
	
//======== 합파불합(6) 내용 summary ========
function summing6(dstin, sts){
	if (gendr == "남양"){n = 1;}else{n = 2;}; txd = "";
	if (sts == "원국"){subj = gj_nfo[4][3];};
	if (sts == "대운"){subj = hgj_nfo[1][3];};
	if (sts == "연운"){subj = hgj_nfo[2][3];};
	if (sts == "월운"){subj = hgj_nfo[3][3];};
	if (sts == "일운"){subj = hgj_nfo[4][3];};
	temp = cgh01_sibsng_simri6chin.filter(isFind);
	if (sts == "원국"){txd += "◐ "+ subj + "(58세~ ) " + "육친의 흉화 (" + temp[0][n+2] + ") </br>";
	}else{	txd += "◐ "+ subj + "육친의 흉화 (" + temp[0][n+2] + ") </br>";};
	if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
};
	
//======== 충 충발(8,) 내용 summary ========
function summing8(dstin){
	sz = ""; txd = "";
	if (ganhc_nfo[3][4].includes("충")){sz = "(20~38세)";};
	if (ganhc_nfo[3][5].includes("충")){sz += "(58세~ )";};
	n = "甲乙丙丁戊己庚辛壬癸".indexOf(sj_dg) + 1; 
	txd += "◐ 충발: 편고함이 지나쳐 객기와 만용을 부리기 쉬우며 대체로 소극적이고 무능한 일면의 부정적경향을 보이거나 정신적 혼란으로 건강을 해치는 등 성격적 결함을 보임 </br>";
	if (n < 5){subj = "편관";};
	if (n > 6){subj = "편재";};
	txd += "◐ " + subj.substr(1,1) + "성(" + subj + ") 부조화--- " + sz + "</br>";	
	rslt0 = "◐ 상신... 몸에 상처가 생김.. ";
	if (n == 1 || n == 7){rslt0 += "(근육통 골다공증 견통 대머리)</br>";}; if (n == 2 || n == 8){rslt0 += "(두통 치통 요통 빙의)</br>";}; 
	if (n == 3 || n == 9){rslt0 += "(심장 또는 신장질환)</br>";}; if (n == 4 || n == 10){rslt0 += "(복부 방광 내분비계통 혼인파혼-작파(作破))</br>";};
	txd += rslt0;	
	temp = cgh01_sibsng_simri6chin.filter(isFind);
	if (gendr == "남양"){ rslt = temp[0][3]; }else{ rslt = temp[0][4]; };	
	txd += "◐ 육친(" + rslt + ") 불화(반목)--- </br>";	
	if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
};
	
//======== 행운천간합 합화오행 육친십성 흉화(0) 내용 summary ========
function summing0(a,dstin){
	subj = a; txd = "";
	temp = sibsungX1.filter(isFind);
	reln = Math.ceil((temp[0].indexOf(gj_nfo[1][3])-2) / 2);
	temp = cgh02_dhap_simrihealth.filter(isFind);
	if (temp[0][5].substr(0,2)=="비견"){reln += 0};
	if (temp[0][5].substr(0,2)=="식상"){reln += 1};
	if (temp[0][5].substr(0,2)=="재성"){reln += 2};
	if (temp[0][5].substr(0,2)=="관성"){reln += 3};
	if (temp[0][5].substr(0,2)=="인성"){reln += 4};
	if (reln>5){ reln = reln - 5;}	

	if (gendr == "남양"){ 
		rslt = cgh01_sibsng_simri6chin[reln * 2 - 1][3];  
		rslt += cgh01_sibsng_simri6chin[reln * 2][3];
	}else{ 
		rslt = cgh01_sibsng_simri6chin[reln * 2 - 1][4]; 
		rslt += cgh01_sibsng_simri6chin[reln * 2][4];
	};	
	txt_ganhn += "◐ 육친(" + rslt + ") 흉화--- </br>";
};

//======== 충거(b) 내용 summary ========
function summingb(dstin){
	n = "甲乙丙丁戊己庚辛壬癸".indexOf(sj_dg) + 1;  txd = "";
	if (n < 5){subj = "편관";};
	if (n > 6){subj = "편재";};
	txd += "◐ " + subj.substr(1,1) + "성(" + subj + ") 발흥--- </br>";	
	rslt0 = "건강회복... 질병 완화.. ";
	if (n == 1 || n == 7){rslt0 += "(근육통 골다공증 견통 대머리)</br>";}; if (n == 2 || n == 8){rslt0 += "(두통 치통 요통 빙의)</br>";}; 
	if (n == 3 || n == 9){rslt0 += "(심장 또는 신장질환)</br>";}; if (n == 4 || n == 10){rslt0 += "(복부 방광 내분비계통)</br>";};
	txd += rslt0;	
	temp = cgh01_sibsng_simri6chin.filter(isFind);
	if (gendr == "남양"){ rslt = temp[0][3]; }else{ rslt = temp[0][4]; };	
	txd += "육친(" + rslt + ") 불화(반목)의 개선 화해--- </br>";	
	if (dstin=="#output1"){txt_ganhc += txd;}else{txt_ganhn += txd;};
};

	//---   hcompchk("천간합",5,sj_yg,sj_mg,2);
function hcompchk(a,b,c,d,e){  
	subj = a; rslt = "";
	chab = ganji_habchung.filter(isFind);  //===천간/지지 합충극형해파
	for (i = 1; i < b + 1; i++){
		texstr = chab[0][i].substr(0,e); 
		if (texstr == (c + d) || texstr == (d + c)){
			rslt = texstr + a.substr(2,1);
		};
	};
};

//====== 행운 천간합충극 체크결과 집계 함수 ======
//----   habchk2(3);
function habchk2(a){
	if (a == 1){bas = sj_yg;}; if (a == 2){bas = sj_mg;}; if (a == 3){bas = sj_dg;}; if (a == 4){bas = sj_tg;}; 
	rslt0 = ""; hcompchk("천간합",5,bas,hn_lg,2); if (rslt != ""){rslt0 += rslt;}; hcompchk("천간충",4,bas,hn_lg,2); if (rslt != ""){rslt0 += rslt;};	hcompchk("천간극",6,bas,hn_lg,2); if (rslt != ""){rslt0 += rslt;};
	ganhc_nfo[a][6] = rslt0; 
	rslt0 = ""; hcompchk("천간합",5,bas,hn_yg,2); if (rslt != ""){rslt0 += rslt;}; hcompchk("천간충",4,bas,hn_yg,2); if (rslt != ""){rslt0 += rslt;};	hcompchk("천간극",6,bas,hn_yg,2); if (rslt != ""){rslt0 += rslt;};
	ganhc_nfo[a][7] = rslt0;
	rslt0 = ""; hcompchk("천간합",5,bas,hn_mg,2); if (rslt != ""){rslt0 += rslt;}; hcompchk("천간충",4,bas,hn_mg,2); if (rslt != ""){rslt0 += rslt;};	hcompchk("천간극",6,bas,hn_mg,2); if (rslt != ""){rslt0 += rslt;};
	ganhc_nfo[a][8] = rslt0;
	rslt0 = ""; hcompchk("천간합",5,bas,hn_dg,2); if (rslt != ""){rslt0 += rslt;}; hcompchk("천간충",4,bas,hn_dg,2); if (rslt != ""){rslt0 += rslt;};	hcompchk("천간극",6,bas,hn_dg,2); if (rslt != ""){rslt0 += rslt;};
	ganhc_nfo[a][9] = rslt0;
//	rslt0 = ""; hcompchk("천간합",5,bas,hn_tg,2); if (rslt != ""){rslt0 += rslt;}; hcompchk("천간충",4,bas,hn_tg,2); if (rslt != ""){rslt0 += rslt;};	hcompchk("천간극",6,bas,hn_tg,2); if (rslt != ""){rslt0 += rslt;};
//	ganhc_nfo[a][10] = rslt0;
};

//========== 천간합충 지지합충형해파==========
function wongug(){
	hcg1 = ""; hcg2 = ""; hcg3 = ""; hcg4 = ""; rt1 = ""; rt2 = ""; rt3 = ""; sj_org2 = ""; hcj1 = ""; hcj2 = ""; hcj3 = ""; hcj4 = ""; ttlhc = ""; ttlh = ""; hcj = ""; rslt_chng = ""; 
	rslt_hyng1 = ""; rslt_hyng2 = ""; rslt_hyng3 = ""; rslt_hyng4 = "";
	
	document.getElementById("output1").innerText += "<<원국>>..... \n";
	if (gj_nfo[1][4].substr(0,1) == "0" && gj_nfo[2][4].substr(0,1) == "0"){rt1 = "0"}else{rt1 = "1"};  //--- 연간합 통근
	if (gj_nfo[2][4].substr(0,1) == "0" && gj_nfo[3][4].substr(0,1) == "0"){rt2 = "0"}else{rt2 = "1"};  //--- 일(월)간합 통근
	if (gj_nfo[3][4].substr(0,1) == "0" && gj_nfo[4][4].substr(0,1) == "0"){rt3 = "0"}else{rt3 = "1"};  //--- 일(시)간합 통근

//------ 원국 천간/지지 합충극 check
	//------------------------------- 천간 -------------------
	//--- 합충관계를 check하여 ganhc_nfo 배열에 저장
	//--- 연간합충
	rslt0 = ""; 
	hcompchk("천간합",5,sj_yg,sj_mg,2); if (rslt != ""){rslt0 += rslt;}; 
	hcompchk("천간충",4,sj_yg,sj_mg,2); if (rslt != ""){rslt0 += rslt;}; 
	hcompchk("천간극",6,sj_yg,sj_mg,2); if (rslt != ""){rslt0 += rslt;};
	ganhc_nfo[1][3] = rslt0; document.getElementById("sj1a").innerText += ganhc_nfo[1][3];  //--- 화면양식에 연간 합충 기록
	ganhc_nfo[2][3] = rslt0;

	//--- 일간합충
	rslt0 = ""; 
	hcompchk("천간합",5,sj_dg,sj_mg,2); if (rslt != ""){rslt0 += rslt;}; 
	hcompchk("천간충",4,sj_dg,sj_mg,2); if (rslt != ""){rslt0 += rslt;}; 
	hcompchk("천간극",6,sj_dg,sj_mg,2); if (rslt != ""){rslt0 += rslt;};
	ganhc_nfo[2][4] = rslt0; document.getElementById("sj3a").innerText += ganhc_nfo[2][3] + ganhc_nfo[2][4];  //--- 화면양식에 월간 합충 기록
	ganhc_nfo[3][4] = rslt0;

	rslt0 = ""; 
	hcompchk("천간합",5,sj_dg,sj_tg,2); if (rslt != ""){rslt0 += rslt;}; 	
	hcompchk("천간충",4,sj_dg,sj_tg,2); if (rslt != ""){rslt0 += rslt;}; 
	hcompchk("천간극",6,sj_dg,sj_tg,2); if (rslt != ""){rslt0 += rslt;};
	ganhc_nfo[3][5] = rslt0; document.getElementById("sj5a").innerText += ganhc_nfo[3][4] + ganhc_nfo[3][5];  //--- 화면양식에 일간 합충 기록
	ganhc_nfo[4][5] = rslt0; document.getElementById("sj7a").innerText += ganhc_nfo[4][5];  //--- 화면양식에 시간 합충 기록

//--- ⓐ 원국 chk
	//------------------------------- 지지 -------------------
	jjhc_nfo[1][1] = sj_yj; jjhc_nfo[2][1] = sj_mj; jjhc_nfo[3][1] = sj_dj; jjhc_nfo[4][1] = sj_tj;
	wongug_chk(sj_yj,sj_mj); jjhc_nfo[1][3] += rslt; jjhc_nfo[2][3] += rslt;  //--- 연-월 합충해파형
	wongug_chk(sj_dj,sj_mj); jjhc_nfo[2][4] += rslt; jjhc_nfo[3][4] += rslt;  //--- 일-월 합충해파형 
	wongug_chk(sj_dj,sj_tj); jjhc_nfo[3][3] += rslt; jjhc_nfo[4][3] += rslt;  //--- 일-시 합충해파형 
	if ("寅巳申丑戌未".includes(sj_yj)){
		wongug_chk(sj_yj,sj_dj); if (rslt.includes("형")){jjhc_nfo[1][5] += rslt.substr(0,2) + "형"; jjhc_nfo[3][5] += rslt.substr(0,2) + "형";};  //--- 연-일 형  
		wongug_chk(sj_yj,sj_tj); if (rslt.includes("형")){jjhc_nfo[1][4] += rslt.substr(0,2) + "형"; jjhc_nfo[4][4] += rslt.substr(0,2) + "형";};  //--- 연-시 형 
	};
	if ("寅巳申丑戌未".includes(sj_mj)){
		wongug_chk(sj_mj,sj_tj); if (rslt.includes("형")){jjhc_nfo[2][5] += rslt.substr(0,2) + "형"; jjhc_nfo[4][5] += rslt.substr(0,2) + "형";};  //--- 월-시 형 
	};
	if (jjhc_nfo[1][3].includes("형")){s = "형" + jjhc_nfo[1][4].substr(2) + jjhc_nfo[1][5].substr(2); solution(s); jjhc_nfo[1][2] = rslt;  //--- 연지 합충해파를 제외한 원국일지 형 (연지)
	}else{	s = jjhc_nfo[1][4].substr(2) + jjhc_nfo[1][5].substr(2); solution(s); jjhc_nfo[1][2] = rslt;};
	if (jjhc_nfo[2][3].includes("형")){s = "형" + jjhc_nfo[2][4].substr(2) + jjhc_nfo[2][5].substr(2); solution(s); jjhc_nfo[2][2] = rslt;  //--- 연지 합충해파를 제외한 원국일지 합충형해파 (월지)
	}else{	s = jjhc_nfo[2][4].substr(2) + jjhc_nfo[2][5].substr(2); solution(s); jjhc_nfo[2][2] = rslt;};
	s = jjhc_nfo[3][3].substr(2) + jjhc_nfo[3][4].substr(2) + jjhc_nfo[3][5].substr(2); solution(s); jjhc_nfo[3][2] = rslt;  //--- 원국일지 합충형해파 (일지)
	s = jjhc_nfo[4][3].substr(2) + jjhc_nfo[4][4].substr(2) + jjhc_nfo[4][5].substr(2); solution(s); jjhc_nfo[4][2] = rslt;  //--- 원국일지 합충형해파 (시지)

	document.getElementById("sj2a").innerText += jjhc_nfo[1][3] + jjhc_nfo[1][4] + jjhc_nfo[1][5];  //--- 화면양식에 연지 합충파해 기록
	document.getElementById("sj4a").innerText += jjhc_nfo[2][3] + jjhc_nfo[2][4] + jjhc_nfo[2][5];  //--- 화면양식에 월지 합충파해 기록
	document.getElementById("sj6a").innerText += jjhc_nfo[3][3] + jjhc_nfo[3][4] + jjhc_nfo[3][5];  //--- 화면양식에 일지 합충파해 기록
	document.getElementById("sj8a").innerText += jjhc_nfo[4][3] + jjhc_nfo[4][4] + jjhc_nfo[4][5];  //--- 화면양식에 시지 합충파해 기록

	//------ 원국 hcg1 코드 생성
	if (ganhc_nfo[1][3].substr(2,1)==""){hcg1 += "----";
	}else{	hcg1 += ganhc_nfo[1][3].substr(2,1) + rt1 + "--";}; 
	hcg1 += "-";
	//--- 원국 hcg2 코드 생성
	if (ganhc_nfo[2][3].substr(2,1)=="" && ganhc_nfo[2][4].substr(2,1)==""){hcg2 += "----";
	}else{	hcg2 += ganhc_nfo[2][4].substr(2,1) + rt2 + "--";}; 
	hcg2 += "-";
	//--- 원국 hcg3 코드 생성
	if (ganhc_nfo[3][4].substr(2,1)=="" && ganhc_nfo[3][5].substr(2,1)==""){hcg3 += "----";
	}else{
		if (ganhc_nfo[3][4].substr(2,1)==""){
			if (sj_mg == sj_dg)	{
				hcg3 += "쟁" + rt2;
			}else{
				hcg3 += "--";
			};
		}else{	
			hcg3 += ganhc_nfo[3][4].substr(2,1) + rt2;
		};
		if (ganhc_nfo[3][5].substr(2,1)==""){if (sj_tg == sj_dg){hcg3 += "쟁" + rt3;}else{hcg3 += "--";};	
		}else{	hcg3 += ganhc_nfo[3][5].substr(2,1) + rt3;}; 
	};
	if (ganhc_nfo[2][2] == ganhc_nfo[3][2]){hcg3 += "1";}else{hcg3 += "0";};  //--- hcg3에 월지 합오행 체크 추가
    //--- 원국 hcg4 코드 생성
	if (ganhc_nfo[4][5].substr(2,1)==""){hcg4 += "----";
	}else{	hcg4 += ganhc_nfo[4][5].substr(2,1) + rt3 + "--";}; 
	hcg4 += "-";
	//=======================================
	ganhc("#output1");
	//------ new version test 원국 지지 합충형해파 결과 출력 ("output1")
	hcj1 = jjhc_nfo[1][2]; hcj2 = jjhc_nfo[2][2]; hcj3 = jjhc_nfo[3][2]; hcj4 = jjhc_nfo[4][2]; 
	ttlhc = hcj1 + hcj2 + hcj3 + hcj4; 
	johc("#output1");
	$("#output1").on("click", "span", function(){ 
		disp("#"+$(this).attr("class").substr(5),"",""); 
	}); 
};

//------ 원국 천간 합충 결과 출력 ("#output1")
let cssn4 = 0; let txt_ganhc = ""; let txt_jjhc = "";
function ganhc(d){
		txt_ganhc = "";
		for (i = 0; i < ca10a_ghabch.length; i++){
			//------ 연간 합충
			if (ca10a_ghabch[i][0] == "연간" && ca10a_ghabch[i][1] == hcg1 && hcg1 != '-----'){
				cssn4 += 1; sts = "연간"; 
				txt_ganhc += '■<span class = "spcs css_gw' + cssn4 + '">' + sts + " " + hcg1 + " " + ganhc_nfo[1][3] + " " + ca10a_ghabch[i][4] +  '</span></br><div id = "css_gw' + cssn4 + '" class = "txca">';  //--- 원국 연간합충 출력
				if (ca10a_ghabch[i][5] == "a"){ 
					txt_ganhc += gj_nfo[1][3] + "--- " + ca10a_ghabch[i][4] + "--( ~19세)</br>";  //--- 연간충(a)-연간
					txt_ganhc += gj_nfo[2][3] + "--- " + ca10a_ghabch[i][4] + "--(20~38세)</br>";  //--- 연간충(a)-월간
				}else{
					if (ca10a_ghabch[i][5] == "c"){n = 1;};  //--- 연간합 긍정(c)
					if (ca10a_ghabch[i][5] == "d"){n = 2;};  //--- 연간합 부정(d)

					ss_simri(gj_nfo[1][3],cgh01_sibsng_simri6chin,n); txt_ganhc += "◐ " + gj_nfo[1][3] + "심리( ~19세)--- " + rslt + "</br>";
					ss_simri(gj_nfo[2][3],cgh01_sibsng_simri6chin,n); txt_ganhc += "◐ " + gj_nfo[2][3] + "심리(20~38세)--- " + rslt + "</br>";
				};
				txt_ganhc += "</div>--------------------------------------------------------------</br>";
			};
			//------ 일간 합충
			if (ca10a_ghabch[i][0] == "일간" && ca10a_ghabch[i][1] == hcg3){  //--- 원국코드 (code1) 및 결과코드 (code2) 생성
				code2 = ca10a_ghabch[i][5]; 
				if (ca10a_ghabch[i][5] ==  "-" || ca10a_ghabch[i][5] ==  "b"){code1 = "-"; code1 += gj_nfo[3][4].substr(0,1); code1 += hcg3.substr(4,1); };
				if (ca10a_ghabch[i][5] > "0" && ca10a_ghabch[i][5] < "7"){code1 = code2; code1 += "-"; code1 += hcg3.substr(4,1); };
				if (ca10a_ghabch[i][5] ==  "7" || ca10a_ghabch[i][5] ==  "8"){code1 = code2; code1 += "--"; };

				if (hcg3.substr(0,4) != '----'){
					if (code2 == "1" || code2 == "2" || code2 == "3"){
						if (ganhc_nfo[3][4].includes("합")){desc = ganhc_nfo[3][4] + " " + ca10a_ghabch[i][4];
						}else{desc = ganhc_nfo[3][5] + " " + ca10a_ghabch[i][4];};
					}else{	
						if (code2 == "8"){
							if (ganhc_nfo[3][4].includes("충")){desc = ganhc_nfo[3][4] + " " + ca10a_ghabch[i][4];
							}else{desc = ganhc_nfo[3][5] + " " + ca10a_ghabch[i][4];};
						}else{	desc = ca10a_ghabch[i][4];};
					};
					result_out(code2, desc, "원국(암시)", d);  //--- 원국 일간합충 출력
				};
			};
		};	
		$("#output1").append(txt_ganhc);
};

//------ new version test 원국 지지 합충형해파 결과 출력 ("output1")
async function johc(d){
		txt = "원국"; sz = ""; pos_ch = ""; txt_jjhc = "";
		if (jjhc_nfo[1][3] != ""){
			if (jjhc_nfo[1][3].includes("합") == true){chkg(sj_yj,sj_mj); rslt += "합"; await yjhab(d);};  //--- 연지합
			if (jjhc_nfo[1][3].includes("충") == true){chkg(sj_yj,sj_mj); rslt += "충"; await yjchng(d);};  //--- 연지충 
			if (jjhc_nfo[1][3].includes("해") == true){chkg(sj_yj,sj_mj); rslt += "해"; await yjhae(d);};  //--- 연지해 
			if (jjhc_nfo[1][3].includes("파") == true){chkg(sj_yj,sj_mj); rslt += "파"; await yjpa(d);};  //--- 연지파 
		};
		if (jjhc_nfo[3][4] != ""){sz = "(20~57세)---"; txt += "(암시)";
			if (jjhc_nfo[3][4].includes("합") == true){chkg(sj_dj,sj_mj); rslt += "합"; await djhab(d);};  //--- 일지합
			if (jjhc_nfo[3][4].includes("충") == true){chkg(sj_dj,sj_mj); rslt += "충"; rslt_chng += rslt; await djchng(d); pos_ch += "2";};  //--- 일지충 
			if (jjhc_nfo[3][4].includes("해") == true){chkg(sj_dj,sj_mj); rslt += "해"; await djhae(sj_mj,sj_dj,2,d);};  //--- 일지해 
			if (jjhc_nfo[3][4].includes("파") == true){chkg(sj_dj,sj_mj); rslt += "파"; await djpa(sj_mj,sj_dj,d);};  //--- 일지파 
			if (rslt != ""){pos += "23"};
		};
		if (jjhc_nfo[3][3] != ""){sz = "(39세~ )---"; txt += "(암시)";
			if (jjhc_nfo[3][3].includes("합") == true){chkg(sj_dj,sj_tj); rslt += "합"; await djhab(d);};  //--- 일지합
			if (jjhc_nfo[3][3].includes("충") == true){chkg(sj_dj,sj_tj); rslt += "충"; rslt_chng += rslt; await djchng(d); pos_ch += "4";};  //--- 일지충 
			if (jjhc_nfo[3][3].includes("해") == true){chkg(sj_dj,sj_tj); rslt += "해"; await djhae(sj_dj,sj_tj,3,d);};  //--- 일지해 
			if (jjhc_nfo[3][3].includes("파") == true){chkg(sj_dj,sj_tj); rslt += "파"; await djpa(sj_dj,sj_tj,d);};  //--- 일지파 
			if (rslt != ""){pos += "34"};
		};
		if (pos_ch != ""){pos_ch = "3" + pos_ch;};
		if (ttlhc.includes("형")){ if (txt.includes("(암시)") == false){txt += "(암시)";};
			johga_chk(1,0,0); 
			if (rslt.length == 3){
				posd = pos; rslt = "寅巳申형"; rslt_hyng1 += rslt; await johha_chk(1,"#output1");
			}else{
				if (rslt.length == 2){
					posd = pos; chkg(rslt.substr(0,1), rslt.substr(1,1)); rslt += "형"; rslt_hyng1 += rslt; await johha_chk(1,"#output1");};};  //--- 지지형(삼형)
			johgb_chk(1,0,0); 
			if (rslt.length == 3){
				posd = pos; rslt = "丑戌未형"; rslt_hyng2 += rslt; await johhb_chk(1,"#output1");
			}else{
				if (rslt.length == 2){
					posd = pos; chkg(rslt.substr(0,1), rslt.substr(1,1)); rslt += "형"; rslt_hyng2 += rslt; await johhb_chk(1,"#output1");};};  //--- 지지형(붕형)
			johgc_chk(1,0,0); 
			if (rslt.length > 1){
				posd = pos; rslt = "子卯형"; rslt_hyng3 += rslt; await johhc_chk(1,"#output1");};  //--- 지지형(상형)
			johgd_chk(1,0,0); 
			if (rslt.length > 1){
				posd = pos; rslt0 += "자형"; rslt_hyng4 += rslt0; await johhd_chk(1,"#output1");};  //--- 지지형(자형)
		};
		$("#output1").append(txt_jjhc);
};

function johga_chk(a,m,n){
//------
	rslt = ""; arr = ["寅","巳","申"]; pos = ""; let jjh_unsng = ""; sjj = "";
	if (a == 1){  //--- 원국
		if (arr.includes(sj_yj)){pos += "1"; if (rslt.includes(sj_yj) == false){rslt += sj_yj;};};
		if (arr.includes(sj_mj)){pos += "2"; if (rslt.includes(sj_mj) == false){rslt += sj_mj;};};
		if (arr.includes(sj_dj)){pos += "3"; if (rslt.includes(sj_dj) == false){rslt += sj_dj;};};
		if (arr.includes(sj_tj)){pos += "4"; if (rslt.includes(sj_tj) == false){rslt += sj_tj;};};
		posd = pos;
	};
	if (a == 2){  //--- 행운
		if (m == 1){sjj = sj_yj}; if (m == 2){sjj = sj_mj}; if (m == 3){sjj = sj_dj}; if (m == 4){sjj = sj_tj}; 
		if (sjj != hnj && arr.includes(sjj) && arr.includes(hnj)){pos += String(n-1); rslt += sjj + hnj; rslt0 += rslt;};
		posd = pos;  
	};
};

function johgb_chk(a,m,n){
//------
	rslt = ""; arr = ["丑","戌","未"]; pos = "";
	if (a == 1){  //--- 원국
		if (arr.includes(sj_yj)){pos += "1"; if (rslt.includes(sj_yj) == false){rslt += sj_yj;};};
		if (arr.includes(sj_mj)){pos += "2"; if (rslt.includes(sj_mj) == false){rslt += sj_mj;};};
		if (arr.includes(sj_dj)){pos += "3"; if (rslt.includes(sj_dj) == false){rslt += sj_dj;};};
		if (arr.includes(sj_tj)){pos += "4"; if (rslt.includes(sj_tj) == false){rslt += sj_tj;};};
		posd = pos;
	};
	if (a == 2){  //--- 행운
		if (m == 1){sjj = sj_yj}; if (m == 2){sjj = sj_mj}; if (m == 3){sjj = sj_dj}; if (m == 4){sjj = sj_tj}; 
		if (sjj != hnj && arr.includes(sjj) && arr.includes(hnj)){pos += String(n-1); rslt += sjj + hnj; rslt0 += rslt;};
		posd = pos;  
	};
};

function johgc_chk(a,m,n){
//------
	rslt = ""; arr = ["子","卯"]; pos = "";
	if (a == 1){  //--- 원국
		if (arr.includes(sj_yj) && arr.includes(sj_mj) && sj_yj != sj_mj){	pos += "12"; if (rslt.includes("子卯") == false){rslt += "子卯";};};
		if (arr.includes(sj_mj) && arr.includes(sj_dj) && sj_mj != sj_dj){ pos += "23"; if (rslt.includes("子卯") == false){rslt += "子卯";};};
		if (arr.includes(sj_dj) && arr.includes(sj_tj) && sj_dj != sj_tj){pos += "34"; if (rslt.includes("子卯") == false){rslt += "子卯";};};
		posd = pos;  
	};
	if (a == 2){  //--- 행운
		if (m == 1){sjj = sj_yj}; if (m == 2){sjj = sj_mj}; if (m == 3){sjj = sj_dj}; if (m == 4){sjj = sj_tj}; 
		if (sjj != hnj && arr.includes(sjj) && arr.includes(hnj)){pos += String(n-1); rslt = sjj + hnj + "형";};
		rslt0 += rslt;	posd = pos;  
	};
};

function johgd_chk(a,m,n){
//------
	arr = ["辰","午","酉","亥"]; pos = "";
	rslt = "";
	if (a == 1){  //--- 원국
		if (arr.includes(sj_yj) && sj_yj == sj_mj){pos += "12"; rslt += sj_yj + sj_mj + "형"; };
		if (arr.includes(sj_mj) && sj_mj == sj_dj){	pos += "23"; rslt += sj_mj + sj_dj + "형"; };
		if (arr.includes(sj_dj) && sj_dj == sj_tj){pos += "34"; rslt += sj_dj + sj_tj + "형"; };
		rslt0 = rslt;	posd = pos;  
	};
	if (a == 2){  //--- 행운
		if (m == 1){sjj = sj_yj}; if (m == 2){sjj = sj_mj}; if (m == 3){sjj = sj_dj}; if (m == 4){sjj = sj_tj}; 
		if (sjj == hnj && arr.includes(hnj)){pos += String(n-1); rslt = sjj + hnj + "형";};
		rslt0 = rslt;	posd = pos;  
	};
};

function solution(s) {
	rslt = "";
	for (let i = 0; i < s.length; i++) {
		if (s.indexOf(s[i]) === i) rslt += s[i];
	};
};

//======= 조건 검색시 (오행, 십신) 조회하는 함수.......... (강약, 글자, 성별은 기존변수 사용) =======
function inquir( a ){  //--- inquir( balance[1] )
	for (i=0; i<a.length; i++){
		if (a[i].includes("목")){ inq_oh1 = a[i] + balance[0][i];};
		if (a[i].includes("화")){ inq_oh2 = a[i] + balance[0][i];};
		if (a[i].includes("토")){ inq_oh3 = a[i] + balance[0][i];};
		if (a[i].includes("금")){ inq_oh4 = a[i] + balance[0][i];};
		if (a[i].includes("수")){ inq_oh5 = a[i] + balance[0][i];};
	};
	nr_oh1 = inq_oh1.substr(1,1);  //--- "목" 오행 갯수 
	ss_oh1 = inq_oh1.substr(2,);  //--- "목" 육신
	nr_oh2 = inq_oh2.substr(1,1);  //--- "화" 오행 갯수 
	ss_oh2 = inq_oh2.substr(2,);  //--- "화" 육신
	nr_oh3 = inq_oh3.substr(1,1);  //--- "토" 오행 갯수 
	ss_oh3 = inq_oh3.substr(2,);  //--- "토" 육신
	nr_oh4 = inq_oh4.substr(1,1);  //--- "금" 오행 갯수 
	ss_oh4 = inq_oh4.substr(2,);  //--- "금" 육신
	nr_oh5 = inq_oh5.substr(1,1);  //--- "수" 오행 갯수 
	ss_oh5 = inq_oh5.substr(2,);  //--- "수" 육신
};
	
//	nr_carac = (sj_ganji.match(/午/g) || []).length;  //--- 글자 갯수 확인
//	console.log( b, nr_oh, "개 ", ss_oh, balance[1][4], gendr, "글자", nr_carac, "개");





//======= 지지 원국/행운 합충형해파 체크 함수 ====== wongug_chk(a,b);  a: base, b: target
function wongug_chk(a,b){
	rslt = ""; subj = a;
	temp11 = jjref.filter(isFind);
	idx = temp11[0].lastIndexOf(b);
	if (idx < 1){
		rslt = "";
	}else{
		chkg(a,b); 
		rslt += jjref[0][idx];
	};
};

function chkg(a,b){
//	if (testg[0].includes(a+b)){  //--- 서버에서는 [0]없으면 오류
	if (testg.includes(a+b)){  //--- 로컬에서는 [0]있으면 오류
		rslt = a + b;
	}else{
		rslt = b + a;
	};
};

//======================
function spclcarac(d){
	txt_wmi = "";
	txt_wmi += "■■  나는 어떤 사람인가? </br></br>";
	//--- 음양 특성 출력(output0) 
	if (gj_nfo[3][2].substr(0,1)=="음"){mptxt = o_hang[3][0] + "사고 지향적. 현재가치 중시. 내향 수동적. 실리(힘 세력) 중시. 수축 수렴 하강 부드러움";};
	if (gj_nfo[3][2].substr(0,1)=="양"){mptxt = o_hang[2][0] +  "행동 지향적. 미래가치 중시. 외향 능동적. 명분(기세 의리) 중시. 팽창 발산 상승 단단함";};
	txt_wmi += "■ 0 음양: "; 
	txt_wmi += '<span class="spcs css_b0">' + mptxt.substr(0,1) + ' (' + mptxt.substr(1,1) + ')</span></br><div id="css_b0" class="txcb">◐ ' + mptxt.substr(2) + '</div>--------------------------------------------------------------</br>';

	//--- 오행 특성 출력(output0) 
	txt_wmi += "■ 1 오행: "; 
	subj = gj_nfo[3][2].substr(1);  //--- 일간의 오행
	oid = o_hang[0].lastIndexOf(subj);
	txt_wmi += '<span class="spcs css_b1">' + subj + ' (' + o_hang[1][oid] + ')</span></br><div id="css_b1" class="txcb">◐ ' + o_hang[4][oid] + ".. " + o_hang[5][oid] + " " + o_hang[5][0] + ".. 성정은 " + o_hang[6][oid] + ".. 강점 " + o_hang[7][oid] + ".. 약점 " + o_hang[8][oid] + ".. 장점 " + o_hang[9][oid] + ".. 단점 " + o_hang[10][oid] + "</br>◐ 특성: " + o_hang[12][oid] + "</br>◐ 심리: " + o_hang[13][oid] + "</br>◐ 동기부여: " + o_hang[14][oid] + '</div>--------------------------------------------------------------</br>';

	//--- 일간 특성 출력(output0) 
	subj = sj_dg; temps0 = a_gan.filter(isFind);
	txt_wmi += "■ 2 일간: "; 
	txt_wmi += '<span class="spcs css_b2">' + subj + '__ ' + temps0[0][1] + '.. ' + temps0[0][2] + '.. ' + temps0[0][4] + '</span></br><div id="css_b2" class="txcb">◐ 특성: ' + temps0[0][6] + "</br>◐ 질병: " + temps0[0][7] + '</div>--------------------------------------------------------------</br>';

	//--- 지지 특성 출력(output0) 
	subj = sj_dj; temps0 = a_jiji.filter(isFind);
	txt_wmi += "■ 3 일지: ";
	txt_wmi += '<span class="spcs css_b3">' + subj + "__ " + temps0[0][1] + '</span></br><div id="css_b3" class="txcb">◐ 특성: ' + temps0[0][4] + "</br>◐ 질병: " + temps0[0][5] + "</br>◐ 직업: " + temps0[0][6] + '</div>--------------------------------------------------------------</br>';

	//--- 일지십성 특성 출력(output0) 
	sibsng(sj_dg,"",sj_dj); subj = js_titl; temps0 = a_ssng.filter(isFind);
	txt_wmi += "■ 4 일지십성: ";
	txt_wmi += '<span class="spcs css_b4">' + subj + "__ " + sj_dg + sj_dj + '</span></br><div id="css_b4" class="txcb">- ' + temps0[0][2] + "</br>◐ 장점: " + temps0[0][3] + "</br>◐ 단점: " + temps0[0][4] + "</br>◐ 태과: " + temps0[0][5] + "</br>◐ 불급: " + temps0[0][6] + "</br>◐ 충: " + temps0[0][7] + '</div>--------------------------------------------------------------</br>';

	//--- 십이운성 특성 출력(output0) 
	unsng(sj_dg,sj_dj); subj = js_titl; temps0 = a_unsng.filter(isFind);
	txt_wmi += "■ 5 십이운성: ";
	txt_wmi += '<span class="spcs css_b5">' + subj + "__ " + sj_dg + sj_dj + '</span></br><div id="css_b5" class="txcb">- ' + temps0[0][5] + '</br>';
	//--- 일지 십성/십이운성 특성 출력(output0) 
	sibsTugsin(gj_nfo[3][7]); let dj_6sin = hs_titl; let dj_n = null;
	if (dj_6sin == "비겁"){dj_n = 7;}; if (dj_6sin == "식상"){dj_n = 8;}; if (dj_6sin == "재성"){dj_n = 9;}; if (dj_6sin == "관성"){dj_n = 10;}; if (dj_6sin == "인성"){dj_n = 11;};
	subj = gj_nfo[3][8]; temps0 = a_unsng.filter(isFind);
	txt_wmi += "◐ 육신/운성: " + dj_6sin + "__" + subj + "</br> - " + temps0[0][dj_n] + " </br>";
	txt_wmi += "--------------------------------------------------------------</br>";
	unsng(sj_dg,sj_yj); subj = js_titl; temps0 = a_unsng.filter(isFind);
	txt_wmi += "◐ 연지: " + subj + "__ " + sj_yj + "</br>  - " + temps0[0][3] + " </br>";
	unsng(sj_dg,sj_mj); subj = js_titl; temps0 = a_unsng.filter(isFind);
	txt_wmi += "◐ 월지: " + subj + "__ " + sj_mj + "</br>  - " + temps0[0][4] + " </br>";
	unsng(sj_dg,sj_tj); subj = js_titl; temps0 = a_unsng.filter(isFind);
	if (sjtx != "x"){ txt_wmi += "◐ 시지: " + subj + "__ " + sj_tj + "</br>  - " + temps0[0][6] + " </br>";};
	txt_wmi += '</div>--------------------------------------------------------------</br>'

	//--- 일주론 출력(output0) 
	subj = sj_dg + sj_dj; temps0 = a_ilju.filter(isFind);
	st= temps0[0][3].indexOf('여자 :');
	if (gendr.substr(0,1)=="남"){adt = 6; lks = temps0[0][3].substr(4,st-5);}; 
	if (gendr.substr(0,1)=="여"){adt = 7; lks = temps0[0][3].substr(st+4);};
	let txt_tts = "";
	txt_tts += "■ 6 일주: ";
	txt_tts += '<span class="spcs css_b6">' + subj + '</span></br><div id="css_b6" class="txcb">- ' + temps0[0][1] + '</br> - ' + temps0[0][2] + '</br> ◐ 외모: ' + lks + '</br> ◐ 직업: ' + temps0[0][4] + '</br> ◐ 결혼: ' + temps0[0][5] + '</br> - ' + temps0[0][adt] + '</br> ◐ 가족: ' + temps0[0][8] + '</br> ◐ 비고: ' + temps0[0][9] + '</div>--------------------------------------------------------------</br>';
	txt_wmi += txt_tts;

	//--- 월지십성 특성 출력(output0) 
	sibsng(sj_dg,"",sj_mj); subj = js_titl; temps0 = a_ssmj.filter(isFind);
	txt_wmi += "■ 7 월지십성: ";
	txt_wmi += '<span class="spcs css_b7">' + subj + "__ " + sj_dg + sj_mj + '</span></br><div id="css_b7" class="txcb">◐ 일반: ' + temps0[0][1] + "</br>◐ 성향: " + temps0[0][2] + "</br>◐ 성격: " + temps0[0][3];
	txt_wmi += '</div>--------------------------------------------------------------</br>';

		//--- 월지십성 육친관계 출력(output0) 
	if (gendr.substr(0,1) == "남"){gnr = 4;};
	if (gendr.substr(0,1) == "여"){gnr = 5;}; //outx = "";
	txt_wmi += "■ 8 육친관계: ";
	txt_wmi += '<span class="spcs css_b8">월지__ ' + sj_mj + '__ ' + gendr.substr(0,1) + '성__ 부모형제 배우자 아들 딸</span></br><div id="css_b8" class="txcb">';
	relstr = a_ssmj[0][gnr].substr(2).split(" ");
	for (i=0; i<relstr.length; i++){
		if (relstr[i] != ""){
			subj = relstr[i]; temp = a_ssmj.filter(isFind);	f_ganji(sj_dg,relstr[i],""); 
			sibsng(g_titl,"",sj_mj); subj = js_titl;  temps0 = a_ssmj.filter(isFind);
			txt_wmi += "◐ " + temp[0][gnr] + "__ " + g_titl + " " + sj_mj + "__" + js_titl + temps0[0][6] + "</br>";
			if (i==3){txt_wmi += "--------------------------------------------------------------</br>"};
		};
	};
	txt_wmi += '</div>--------------------------------------------------------------</br>';

	$(d).append(txt_wmi);
	$(d).on("click", "span", function(){ 
		disp("#"+$(this).attr("class").substr(5),"",""); 
		if ($(this).attr("class").substr(5)=="css_b6" && $("#css_b6").css("display")==="block"){
			speak(txt_tts, {rate: 0.7, pitch: 0.6, lang: "ko-KR" });
		}else{
			window.speechSynthesis.cancel();
		};
	}); 
};

//======= 행운 계산 검토 함수 ======
function hangun(){	
	hn_lg = ""; hn_yg = ""; hn_mg = ""; hn_dg = ""; hn_tg = ""; hn_lj = ""; hn_yj = ""; hn_mj = ""; hn_dj = ""; hn_tj = ""; ageL = 0; ageY = 0; rslt0 = ""; hnj = "";
	$('.hun1').empty(); $('.hun2').empty(); $('.hun3').empty(); txt_hn = ""; txt_ganhn = ""; txt_jjhn = "";
	$('#output3').empty(); $('#outputb').empty(); $('#ssalb').empty();
	$('#output3a').empty(); $('#output4').empty(); $('#output5').empty();
	hunD = document.getElementById('hunDate').value;  //--- 행운 일자
	hunD = hunD + " 04:30"; vwyr = Number(hunD.substr(0,4));
	//----- 대운
	for (i=1; i<15; i++){
		if (vwyr-birth1.getFullYear()+1 >= age+(i-1)*10 && vwyr-birth1.getFullYear()+1 < age+i*10){
			hn_lg = hun_list[i][1]; hn_lj = hun_list[i][5]; ageL = age + (i - 1) * 10;
			document.getElementById("hunL2").innerText += "(" + ageL + ")\n";
			document.getElementById("hunL1").innerText += hn_lg + "\n";
			document.getElementById("hunL2").innerText += hun_list[i][3] + " " + hun_list[i][2] + "\n";
			document.getElementById("hunL1").innerText += hn_lj + "\n";
			document.getElementById("hunL2").innerText += "\n" + hun_list[i][7] + " " + hun_list[i][6] + " " + hun_list[i][8] + " \n";
		};
	};
	if (hunD >= ca08_monthstart[1][5] && hunD < ca08_monthstart[ca08_monthstart.length-1][5]){	
		convrtsj(hunD); hunD1 = rqD1;
		subj = tsj1; temp = gan.filter(isFindj); hn_yg = temp[0][0]; hygoh = temp[0][4].substr(1,2);  //--- 한글 행운간지를 한자로 바꿈
		subj = tsj2; temp = jiji.filter(isFindj); hn_yj = temp[0][0]; hyjoh = temp[0][4].substr(1,2);  //--- 한글 행운간지를 한자로 바꿈
		subj = tsj3; temp = gan.filter(isFindj); hn_mg = temp[0][0]; hmgoh = temp[0][4].substr(1,2);  //--- 한글 행운간지를 한자로 바꿈
		subj = tsj4; temp = jiji.filter(isFindj); hn_mj = temp[0][0]; hmjoh = temp[0][4].substr(1,2);  //--- 한글 행운간지를 한자로 바꿈
		subj = tsj5; temp = gan.filter(isFindj); hn_dg = temp[0][0]; hdgoh = temp[0][4].substr(1,2);  //--- 한글 행운간지를 한자로 바꿈
		subj = tsj6; temp = jiji.filter(isFindj); hn_dj = temp[0][0]; hdjoh = temp[0][4].substr(1,2);  //--- 한글 행운간지를 한자로 바꿈
		subj = tsj7; temp = gan.filter(isFindj); hn_tg = temp[0][0]; htgoh = temp[0][4].substr(1,2);  //--- 한글 행운간지를 한자로 바꿈
		subj = tsj8; temp = jiji.filter(isFindj); hn_tj = temp[0][0]; htjoh = temp[0][4].substr(1,2);  //--- 한글 행운간지를 한자로 바꿈
	}else{
		hyr = (vwyr - 1864) % 60; idx = hyr % 10 + 1; hn_yg = gan[idx][0]; hygoh = gan[idx][4].substr(1,2); idx = hyr % 12 + 1; hn_yj = jiji[idx][0]; hyjoh = jiji[idx][4].substr(1,2);
		hmo = (hyr % 5) * 12 + Number(hunD.substr(5,2)); idx = hmo % 10 + 1; hn_mg = gan[idx][0]; hmgoh = gan[idx][4].substr(1,2); idx = hmo % 12 + 1; hn_mj = jiji[idx][0]; hmjoh = jiji[idx][4].substr(1,2);
		hda = Math.ceil((new Date(hunD).getTime() - new Date('1908-01-10').getTime()) / 86400000) % 60; idx = hda % 10 + 1; hn_dg = gan[idx][0]; hdgoh = gan[idx][4].substr(1,2); idx = hda % 12 + 1; hn_dj = jiji[idx][0]; hdjoh = jiji[idx][4].substr(1,2);
	};
	hgj_nfo[1][1] = hn_lg; hgj_nfo[1][5] = hn_lj; hgj_nfo[2][1] = hn_yg; hgj_nfo[2][5] = hn_yj; hgj_nfo[3][1] = hn_mg; hgj_nfo[3][5] = hn_mj; hgj_nfo[4][1] = hn_dg; hgj_nfo[4][5] = hn_dj; 
	mktable(1,hn_lg,hn_lj,hgj_nfo);  //--- 행운 테이블(hgj_nfo) 생성
	mktable(2,hn_yg,hn_yj,hgj_nfo);
	mktable(3,hn_mg,hn_mj,hgj_nfo);
	mktable(4,hn_dg,hn_dj,hgj_nfo);
	hn_ganji = hn_lg + hn_lj + hn_yg + hn_yj + hn_mg + hn_mj + hn_dg + hn_dj;

	if (ganhc_nfo[1][3].substr(2,1) != "합" && ganhc_nfo[1][3].substr(2,1) != "충"){habchk2(1);};  //--- 원국에 연간합충이 없으면 행운 check (천간합 흉화)
	if (	(ganhc_nfo[2][3].substr(2,1) != "합" && ganhc_nfo[2][3].substr(2,1) != "충") ||	(ganhc_nfo[2][4].substr(2,1) == "합" || ganhc_nfo[2][4].substr(2,1) == "충")){habchk2(2);};   //--- 월간에 연간합충이 없거나 (천간합 흉화) 일간합충이 있으면 행운 check (일간 행운)
	habchk2(3);  //--- 행운 check (일간 행운)
	habchk2(4);  //--- 시간에 일간합충이 있거나 (일간 행운) 없으면 (천간합 흉화) 행운 check

//---------------------------------------------------------------	
	if (jjhc_nfo[1][2] != ""){
		wongug_chk(sj_yj,hn_lj); jjhc_nfo[1][6] = rslt; wongug_chk(sj_yj,hn_yj); jjhc_nfo[1][7] = rslt; 
		wongug_chk(sj_yj,hn_mj); jjhc_nfo[1][8] = rslt; wongug_chk(sj_yj,hn_dj); jjhc_nfo[1][9] = rslt;
	};
	if (jjhc_nfo[2][2] != ""){
		wongug_chk(sj_mj,hn_lj); jjhc_nfo[2][6] = rslt; wongug_chk(sj_mj,hn_yj); jjhc_nfo[2][7] = rslt; 
		wongug_chk(sj_mj,hn_mj); jjhc_nfo[2][8] = rslt; wongug_chk(sj_mj,hn_dj); jjhc_nfo[2][9] = rslt;
	};
	wongug_chk(sj_dj,hn_lj); jjhc_nfo[3][6] = rslt; wongug_chk(sj_dj,hn_yj); jjhc_nfo[3][7] = rslt; 
	wongug_chk(sj_dj,hn_mj); jjhc_nfo[3][8] = rslt; wongug_chk(sj_dj,hn_dj); jjhc_nfo[3][9] = rslt;
	if (jjhc_nfo[4][2] != ""){
		wongug_chk(sj_tj,hn_lj); jjhc_nfo[4][6] = rslt; wongug_chk(sj_tj,hn_yj); jjhc_nfo[4][7] = rslt; 
		wongug_chk(sj_tj,hn_mj); jjhc_nfo[4][8] = rslt; wongug_chk(sj_tj,hn_dj); jjhc_nfo[4][9] = rslt;
	};
//---------------------------------------------------------------
	outptt();  //--- 참조용 테이블 화면출력 --- "output4" & "output5"
	//----- 연운
	ageY = vwyr - birth1.getFullYear() + 1;
	document.getElementById("hunY2").innerText += vwyr + " (" + ageY + ")\n";
	document.getElementById("hunY1").innerText += hn_yg + "\n";
	document.getElementById("hunY2").innerText += hgj_nfo[2][3] + " " + hgj_nfo[2][2] + "\n";
	document.getElementById("hunY1").innerText += hn_yj + "\n";
	document.getElementById("hunY2").innerText += "\n" + hgj_nfo[2][7] + " " + hgj_nfo[2][6] + " " + hgj_nfo[2][8] + "\n";
	//----- 월운
	document.getElementById("hunM2").innerText += hunD.substr(0,7) + "\n";
	document.getElementById("hunM1").innerText += hn_mg + "\n";
	document.getElementById("hunM2").innerText += hgj_nfo[3][3] + " " + hgj_nfo[3][2] + "\n";
	document.getElementById("hunM1").innerText += hn_mj + "\n";
	document.getElementById("hunM2").innerText += "\n" + hgj_nfo[3][7] + " " + hgj_nfo[3][6] + " " + hgj_nfo[3][8] + "\n";
	//----- 일운
	document.getElementById("hunD2").innerText += hunD.substr(0,10) + "\n";
	document.getElementById("hunD1").innerText += hn_dg + "\n";
	document.getElementById("hunD2").innerText += hgj_nfo[4][3] + " " + hgj_nfo[4][2] + "\n";
	document.getElementById("hunD1").innerText += hn_dj + "\n";
	document.getElementById("hunD2").innerText += "\n" + hgj_nfo[4][7] + " " + hgj_nfo[4][6] + " " + hgj_nfo[4][8] + "\n";

	txt_hn += "<<행운 운세분석>>..... </br>";
	hanal(1,hn_lg,hn_lj,hn_yg,hn_yj); txt_hn += vwyr + "(" + ageY + ") " + hv8 + "... 연운: (" + hn_yg + hn_yj + ") " + hv10 + "- " + hv9 + "</br>"; hv10a = "연운: " + hv10;
	hanal(2,hn_yg,hn_yj,hn_mg,hn_mj); txt_hn += hunD.substr(0,7) + "- " + hv8 + "... 월운: (" + hn_mg + hn_mj + ") " + hv10 + "- " + hv9 + "</br>"; hv10b = "월운: " + hv10;
	hanal(3,hn_mg,hn_mj,hn_dg,hn_dj); txt_hn += hunD.substr(2,8) + " " + hv8 + "... 일운: (" + hn_dg + hn_dj + ") " + hv10 + "- " + hv9 + "</br>"; hv10c = "일운: " + hv10;
	txt_hn += "-----------------------------------------------------------------------------------</br>";

	txt_hn += "<<행운결과>>..... </br>";
	$("#output3").append(txt_hn);
	ganhn("#output3");
	jijihn("#output3");
	$('#output3').on("click", "span", function(){ 
		disp("#"+$(this).attr("class").substr(5),"",""); 
	}); 
	sinsalhn('#outputb');
	gongmangh("#output3a");
};

//■■■■■■■■■■■■■■■■■■■■
//======= 행운 신살 description =======
let sinsaltxt1 = ""; let snsal1 = [];
function sinsalhn_out(csno1, sinsaltxt1, g, h, a, b){
	$("#"+csno1).empty();
	snsal1 = sinsaltxt1.split(" ");
	for (i=0; i<snsal1.length; i++){
		if (snsal1[i] != ""){
			subj = snsal1[i]; temps2 = sinsal_gen.filter(isFindx); sinsal_nfo[g][h] += subj + " ";
			txt_sinsalh += "◐ " + temps2[0][0] + "..... " ;
			if (temps2[0][1] != ""){txt_sinsalh += temps2[0][1] + "</br>";};
			if (temps2[0][4] != ""){txt_sinsalh += temps2[0][4] + "</br>";};
			if (temps2[0][2] != "" && gendr.substr(0,1) == "남"){txt_sinsalh += temps2[0][2] + "</br>";};
			if (temps2[0][3] != "" && gendr.substr(0,1) == "여"){txt_sinsalh += temps2[0][3] + "</br>";};
			if (subj=="원진"){wonjin("hn", g, h, a, b);};
		};
	};
};

//======= 행운 신살 조회 =======
async function sinsalhn(d){
	csno1 = ""; cssn1 = 0; sinsalh_tlist = ""; txt_sinsalh = "";
	for (i=1; i<9; i++){  //--- 변경에 앞서 기존기록 비우기 (행운 영역)
		for (j=6; j<11; j++){sinsal_nfo[i][j] = "";};
	};
	txt_sinsalh += "■■  (행운) 신살 _____ </br></br>";
	await sinsal01(sj_dg,hn_lj,sinsal_list1,"da03_dg_jj-dg_hlyj",d,"hunL3",3,6); //--- 신살 체크3 -------------------
	await sinsal01(sj_dg,hn_yj,sinsal_list1,"da03_dg_jj-dg_hlyj",d,"hunY3",3,7); //--- 신살 체크3 -------------------
	await sinsal01(sj_dg,hn_lj,sinsal_list1,"da05_dg_tj-dg_hj",d,"hunL3",3,6); //--- 신살 체크5 -------------------
	await sinsal01(sj_dg,hn_yj,sinsal_list1,"da05_dg_tj-dg_hj",d,"hunY3",3,7); //--- 신살 체크5 -------------------
	await sinsal01(sj_dg,hn_mj,sinsal_list1,"da05_dg_tj-dg_hj",d,"hunM3",3,8); //--- 신살 체크5 -------------------
	await sinsal01(sj_dg,hn_dj,sinsal_list1,"da05_dg_tj-dg_hj",d,"hunD3",3,9); //--- 신살 체크5 -------------------
	if (sinsal_tlist.includes("간여지동")){
		await sinsal01(hn_lg,hn_lj,sinsal_list1,"da08_gj_dgj-hgj",d,"hunL3",8,6); //--- 신살 체크8 -------------------
		await sinsal01(hn_yg,hn_yj,sinsal_list1,"da08_gj_dgj-hgj",d,"hunY3",8,7); //--- 신살 체크8 -------------------
		await sinsal01(hn_mg,hn_mj,sinsal_list1,"da08_gj_dgj-hgj",d,"hunM3",8,8); //--- 신살 체크8 -------------------
		await sinsal01(hn_dg,hn_dj,sinsal_list1,"da08_gj_dgj-hgj",d,"hunD3",8,9); //--- 신살 체크8 -------------------
	};
	if (sinsal_tlist.includes("백호")){
		await sinsal01(hn_lg,hn_lj,sinsal_list1,"da12_gj_gj-hgj",d,"hunL3",8,6); //--- 신살 체크12 -------------------
		await sinsal01(hn_yg,hn_yj,sinsal_list1,"da12_gj_gj-hgj",d,"hunY3",8,7); //--- 신살 체크12 -------------------
		await sinsal01(hn_mg,hn_mj,sinsal_list1,"da12_gj_gj-hgj",d,"hunM3",8,8); //--- 신살 체크12 -------------------
		await sinsal01(hn_dg,hn_dj,sinsal_list1,"da12_gj_gj-hgj",d,"hunD3",8,9); //--- 신살 체크12 -------------------
	};
	await sinsal01(sj_dg,hn_yj,sinsal_list1,"da13_-dg_hyj",d,"hunY3",3,7); //--- 신살 체크13 -------------------
//------------------------------
	await sinsal01(sj_dj,hn_lj,sinsal_list1,"db01_dj_jj-dj_hj",d,"hunL3",7,6); //--- 신살 체크1 -------------------
	await sinsal01(sj_dj,hn_yj,sinsal_list1,"db01_dj_jj-dj_hj",d,"hunY3",7,7); //--- 신살 체크1 -------------------
	await sinsal01(sj_dj,hn_mj,sinsal_list1,"db01_dj_jj-dj_hj",d,"hunM3",7,8); //--- 신살 체크1 -------------------
	await sinsal01(sj_dj,hn_dj,sinsal_list1,"db01_dj_jj-dj_hj",d,"hunD3",7,9); //--- 신살 체크1 -------------------
	await sinsal01(sj_dj,hn_lj,sinsal_list1,"db02_dj_mtj-dj_hj",d,"hunL3",7,6); //--- 신살 체크2 -------------------
	await sinsal01(sj_dj,hn_yj,sinsal_list1,"db02_dj_mtj-dj_hj",d,"hunY3",7,7); //--- 신살 체크2 -------------------
	await sinsal01(sj_dj,hn_mj,sinsal_list1,"db02_dj_mtj-dj_hj",d,"hunM3",7,8); //--- 신살 체크2 -------------------
	await sinsal01(sj_dj,hn_dj,sinsal_list1,"db02_dj_mtj-dj_hj",d,"hunD3",7,9); //--- 신살 체크2 -------------------
	await sinsal01(sj_dj,hn_lj,sinsal_list1,"db04_dj_ymtj-dj_hj",d,"hunL3",7,6); //--- 신살 체크4 -------------------
	await sinsal01(sj_dj,hn_yj,sinsal_list1,"db04_dj_ymtj-dj_hj",d,"hunY3",7,7); //--- 신살 체크4 -------------------
	await sinsal01(sj_dj,hn_mj,sinsal_list1,"db04_dj_ymtj-dj_hj",d,"hunM3",7,8); //--- 신살 체크4 -------------------
	await sinsal01(sj_dj,hn_dj,sinsal_list1,"db04_dj_ymtj-dj_hj",d,"hunD3",7,9); //--- 신살 체크4 -------------------
	await sinsal01(sj_dj,hn_yj,sinsal_list1,"db05_dj_ymtj-dj_hyj",d,"hunY3",7,7); //--- 신살 체크5 -------------------
	await sinsal01(sj_mj,hn_yj,sinsal_list1,"db08_mj_ydtj-mj_hyj",d,"hunY3",6,7); //--- 신살 체크8 -------------------
	await sinsal01(sj_yj,hn_yj,sinsal_list1,"db09_-yj_hyj",d,"hunY3",5,7); //--- 신살 체크9 -------------------
	await pngduh(2,10); //--- 평두
	await chnrjmh(3,10); //--- 천라지망
	await bogeumh(6,10); //--- 복음
	await baneumh(7,10); //--- 반음
	$(d).append(txt_sinsalh);
	$(d).on("click", "span", function(){ 
		disp("#"+$(this).attr("class").substr(5),"",""); 
	}); 
};

//========== 신살 종류별 행운체크 ==============
function sinsal01(a,b,c,f,d,e,g,h){ //=== a: base, b: target, c: list, d: destin, e: destin2
	return new Promise(function (resolve, reject){
		//========== 배열 영역 (frames) ======================
		ttgt = ""; if (h==6){ttgt="대운";}; if (h==7){ttgt="연운";}; if (h==8){ttgt="월운";}; if (h==9){ttgt="일운";}; 
		let sslist1 = $.map(c, function(element, index) {
			if (element[13] == f) {
				return [element]
			};
		});
		subj = a; temps2 = sslist1.filter(isFind); sinsaltxt1 = "";
		idx = c[0].lastIndexOf(b); sinsaltxt1 = temps2[0][idx];
		if (sinsaltxt1 != ""){
			sinsalh_tlist += sinsaltxt1 + " ";
			cssn1 += 1; csno1 = "css_c" + cssn1;
			txt_sinsalh += '■ <span class="spct ' + csno1 + '">' + sinsaltxt1 + '</span>';
			txt_sinsalh += '________ ' + a + '___ ' + b + '(' + ttgt + ')________ ' + f + '</br>';
			txt_sinsalh += '<div id="' + csno1 + '" class="txcc">';
			sinsalhn_out(csno1, sinsaltxt1, g, h, a, b);
			txt_sinsalh += "</div>--------------------------------------------------------------</br>";
			document.getElementById(e).innerText += sinsaltxt1 + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//--- 참조용 테이블 화면출력 --- "output4" & "output5"
function outptt(){
	ptt(gj_nfo,"gj_nfo : 천간지지","#output4");
	ptt(balance,"balance : 사주강약 균형","#output4");
	ptt(yongsin,"yongsin : 용신취용","#output4");
	ptt(hun_list,"hun_list : 대운","#output4");
	ptt(hgj_nfo,"hgj_nfo : 행운간지","#output5");
	ptt(ganhc_nfo,"ganhc_nfo : 천간합충","#output5");
	ptt(jjhc_nfo,"jjhc_nfo : 지지합충형해파","#output5");
	ptt(sinsal_nfo,"sinsal_nfo : 신살","#output5");
	ptt(gongmang_nfo,"gongmang_nfo : 공망","#output5");
};

//--- "output4" & "output5" 출력 양식 작성하는 함수
let out_string = ""; let rda = "";
function ptt(a,b,destin){
	$( function() {
		out_string = ""; rda = "";
		out_string = "<span class='rdat'>" + b + "</span><br/>";
		out_string += "<table>";
		for (i=0; i<a.length; i++){
			if (a[i].length>12){rda = "rdat"; rda0 = $(".rdat0"); rda1 = $(".rdat1"); rda2 = $(".rdat2");
			}else{	rda = "rdau"; rda0 = $(".rdau0"); rda1 = $(".rdau1"); rda2 = $(".rdau2");};
			out_string += "<tr>";
			for (j=0; j<a[i].length; j++){
				if (i==0){
					if (j==0){
						out_string += "<td class='" + rda + "0'>" + a[i][j];
					}else{
						if (j==a[i].length-1){
							out_string += "</td><td class='" + rda + "2'>" + a[i][j];
						}else{
							out_string += "</td><td class='" + rda + "0'>" + a[i][j];
						};
					};
				}else{
					if (j==0){
						out_string += "<td class='" + rda + "1'>" + a[i][j];
					}else{
						if (j==a[i].length-1){
							out_string += "</td><td class='" + rda + "2'>" + a[i][j];
						}else{
							out_string += "</td><td class='" + rda + "1'>" + a[i][j];
						};
					};
				};
				if (a[i][j]==""){out_string += "-";};
			};
			out_string += "</tr>";
		};
		out_string += "</table>";
		$(destin).append(out_string);
	});
};

let txt = ""; let txt2 = ""; let txt3 = "";
//--- ⓓ 행운 chk ---------- 지지 행운 합충형해파
async function jijihn(d){
	smry = ""; 
	await jjhn(3,6); 
	await jjhn(3,7); 
	await jjhn(3,8); 
	await jjhn(3,9); 
	if (jjhc_nfo[1][2] != ""){
		await jjhn(1,6); 
		await jjhn(1,7); 
		await jjhn(1,8); 
		await jjhn(1,9);
	};
	if (jjhc_nfo[2][2] != ""){
		await jjhn(2,6); 
		await jjhn(2,7); 
		await jjhn(2,8); 
		await jjhn(2,9);
	};
	if (jjhc_nfo[4][2] != ""){
		await jjhn(4,6); 
		await jjhn(4,7); 
		await jjhn(4,8); 
		await jjhn(4,9);
	}; 
	$(d).append(txt_jjhn);
}; 

//-------- 지지 행운 합충형해파(개별)
function jjhn(m,n){
	return new Promise(function (resolve, reject){
		hncd = ""; texstr = jjhc_nfo[m][n]; // txt2 = "";
		if (texstr != ""){	hncd = texstr.substr(2);};   //--- 행운 코드 생성
		hcj = jjhc_nfo[m][2]; //--- (연월일시)지 원국 합충형해파
		if (hcj != ""){
			for (l=0; l<hcj.length; l++){  //--- 원국 코드마다 실행
				if (hncd != ""){
					for (j=0; j<hncd.length; j++){  //--- 행운 코드마다 실행

						if (n == 6){txt2 = "대운"; txt3 = "(암시) "; hnj = hn_lj; 
							if (hcj.includes(hncd.substr(j,1)) == false){hcj += hncd.substr(j,1);};}; 
						if (n == 7){txt2 = hv10a; hnj = hn_yj;
							if (hcj.includes(hncd.substr(j,1))){txt3 = "(실행) ";
							}else{	txt3 = "(암시) "; hcj += hncd.substr(j,1);};}; 
						if (n == 8){txt2 = hv10b; hnj = hn_mj;
							if (hcj.includes(hncd.substr(j,1))){txt3 = "(실행) ";
							}else{	txt3 = "(암시) "; hcj += hncd.substr(j,1);};}; 
						if (n == 9){txt2 = hv10c; hnj = hn_dj;
							if (hcj.includes(hncd.substr(j,1))){txt3 = "(실행) ";
							}else{	txt3 = "(암시) "; hcj += hncd.substr(j,1);};}; 
						txt = txt2.substr(0,2) + txt3;
						rslt0 = "★★ "; rslt = texstr.substr(0,2) + hncd.substr(j,1);
						subj = hcj.substr(l,1) + hncd.substr(j,1); 
						temp = ca12_jhabch.filter(isFind); 
						rslt_hyng = rslt_hyng1 + rslt_hyng2 + rslt_hyng3 + rslt_hyng4;

						if (subj == "충충" || subj == "충형"){
							rslt0 += subj + "(" + rslt + ") => "; 
							rslt = rslt_chng;
						}else{
							if (subj == "형충" || subj == "형형"){
								rslt0 += subj + "(" + rslt + ") => ";
								rslt = rslt_hyng; 
							}else{
								rslt0 += subj + "=> (" + subj.substr(0,1) + ") ";
							};
						};
						rslt0 += temp[0][1] + "... " + rslt;
						if (temp[0][2] == "7"){
							suspend("#output3");
						}else{
							if (smry.includes(rslt)){
								continue;
							}else{
								jjhn_a();
							};
						};
					};
				};
			};
		}else{
			if (m == 3){
				for (j=0; j<hncd.length; j++){  //--- 행운 코드마다 실행
						if (n == 6){txt2 = "대운"; txt3 = "(암시) "; hnj = hn_lj; 
							if (hcj.includes(hncd.substr(j,1)) == false){hcj += hncd.substr(j,1);};}; 
						if (n == 7){txt2 = hv10a; hnj = hn_yj;
							if (hcj.includes(hncd.substr(j,1))){txt3 = "(실행) ";
							}else{	txt3 = "(암시) "; hcj += hncd.substr(j,1);};}; 
						if (n == 8){txt2 = hv10b; hnj = hn_mj;
							if (hcj.includes(hncd.substr(j,1))){txt3 = "(실행) ";
							}else{	txt3 = "(암시) "; hcj += hncd.substr(j,1);};}; 
						if (n == 9){txt2 = hv10c; hnj = hn_dj;
							if (hcj.includes(hncd.substr(j,1))){txt3 = "(실행) ";
							}else{	txt3 = "(암시) "; hcj += hncd.substr(j,1);};}; 
						txt = txt2.substr(0,2) + txt3;
					rslt0 = "★★ "; 
					subj = "-" + hncd.substr(j,1);
					rslt0 += subj + "=> 행운";
					temp = ca12_jhabch.filter(isFind); 
					rslt0 += temp[0][1] + "... "; rslt = texstr.substr(0,2) + hncd.substr(j,1);
					if (smry.includes(rslt)){
						continue;
					}else{
						jjhn_b();
					};
				};
			};
		};
		resolve();
	});
};

async function jjhn_a(){
								if (rslt.substr(0,1) == rslt.substr(1,1)){rslt += "자형"; smry += rslt;}else{smry += rslt;};
								if (temp[0][2] == "1"){await djhab("#output3");};  //--- 합
								if (temp[0][2] == "2"){await djchng("#output3");};  //--- 충
								if (temp[0][2] == "3"){
									if (m == 2){await djhae(sj_mj,hnj,2,"#output3");};
									if (m == 3){await djhae(sj_dj,hnj,0,"#output3");};
									if (m == 4){await djhae(sj_tj,hnj,3,"#output3");};};  //--- 해
								if (temp[0][2] == "4"){  //--- 파
									if (m == 2){await djpa(sj_mj,hnj,"#output3");};
									if (m == 3){await djpa(sj_dj,hnj,"#output3");};
									if (m == 4){await djpa(sj_tj,hnj,"#output3");};};
								if (temp[0][2] == "5"){
									johga_chk(2,m,n); if (rslt.length == 2){posd = pos; chkg(rslt.substr(0,1), rslt.substr(1,1)); rslt += "형"; await johha_chk(2,"#output3");};
									johgb_chk(2,m,n); if (rslt.length == 2){posd = pos; chkg(rslt.substr(0,1), rslt.substr(1,1)); rslt += "형"; await johhb_chk(2,"#output3");};
									johgc_chk(2,m,n); if (rslt.length > 1){posd = pos; rslt = "子卯형"; await johhc_chk(2,"#output3");};
									johgd_chk(2,m,n); if (rslt.length > 1){posd = pos; await johhd_chk(2,"#output3");};};  //--- 형
								if (temp[0][2] == "8"){rslt0 = hcj.substr(l,1) + "+해=> 흉화--- "; rslt = texstr.substr(0,2) + hncd.substr(j,1); await hwunghwa(sj_dj,hnj,"#output3");};  //--- 해 흉화
};

async function jjhn_b(){
						smry += rslt;
						if (temp[0][2] == "1"){await djhab("#output3");};  //--- 합
						if (temp[0][2] == "2"){await djchng("#output3");};  //--- 충
						if (temp[0][2] == "3"){await djhae(sj_dj,hnj,0,"#output3");};  //--- 해
						if (temp[0][2] == "4"){await djpa(sj_dj,hnj,"#output3");};  //--- 파
						if (temp[0][2] == "5"){
							johga_chk(2,m,n); if (rslt.length == 2){posd = pos; chkg(rslt.substr(0,1), rslt.substr(1,1)); rslt += "형"; await johha_chk(2,"#output3");};
							johgb_chk(2,m,n); if (rslt.length == 2){posd = pos; chkg(rslt.substr(0,1), rslt.substr(1,1)); rslt += "형"; await johhb_chk(2,"#output3");};
							johgc_chk(2,m,n); if (rslt.length > 1){posd = pos; rslt = "子卯형"; await johhc_chk(2,"#output3");};
							johgd_chk(2,m,n); if (rslt.length > 2){posd = pos; await johhd_chk(2,"#output3");};
						};  //--- 형
};

//======= 행운 운세분석 ====== ■■■■■■■■ new version ■■■■■■■■
//--- hanal(e,a,b,c,d); ----- hanal(2,a,b,c,d);
function hanal(e,a,b,c,d){
	hv0 = ""; hv1 = ""; hv2 = ""; hv3 = ""; hv4 = ""; hv5 = ""; hv6 = ""; hv7 = ""; hv8 = ""; hv9 = ""; hv10 = ""; hs_titl = "";
	sibsng(sj_dg,a,b); hv1 = gs_titl; hv2 = js_titl;  //--- 일간기준 행운간지(시기 체)의 십성
	sibsng(c,"",d); hv4 = js_titl;  //--- 행운간지(실행 용)의 자체십성
	sibsng(sj_dg,"",sj_dj); hv5 = js_titl;  //--- 일주의 십성
	subj = hv5; hv0 = ca01_actss.filter(isFind);  //--- 일주의 실행분석 십성배열
	idx = ca01_actss[0].lastIndexOf(hv4);
	hv6 = hv0[0][idx];  //--- 실행 십성 (hv6)
	if (e == 1){
		if (ageY < ageL + 5){hv3 = hv1;}else{hv3 = hv2;};  //--- 시기 십성 (hv3)
	};
	if (e == 2){
		if ("寅卯辰巳午未".includes(d)){hv3 = hv1;}else{hv3 = hv2;};  //--- 시기 십성 (hv3)
	};
	if (e == 3){
		if (hunD < ca08_monthstart[ca08_monthstart.length-1][5]){
			refD = new Date(premon.format('yyyy-MM-dd HH:mm'));
			refD = new Date(refD.setDate(refD.getDate() + 15));
			if (hunD1 < refD){hv3 = hv1;}else{hv3 = hv2;};  //--- 시기 십성 (hv3)
		}else{
			subj = ca08_monthstart[ca08_monthstart.length-1][5].substr(0,4) + hunD.substr(4,3);
			temp = ca08_monthstart.filter(isFindx); refD = new Date(temp[0][5]);
			refD = new Date(refD.setDate(refD.getDate() + 15));
			if (hunD.substr(5,11) < refD.format('MM-dd HH:mm')){hv3 = hv1;}else{hv3 = hv2;};  //--- 시기 십성 (hv3)
		};
	};
	if (e == 4){
		if ("子丑寅卯辰巳".includes(d)){hv3 = hv1;}else{hv3 = hv2;};  //--- 시기 십성 (hv3)
	};

	subj = hv6; hv7 = ca02_actgdbad.filter(isFind);  //--- 실행분석 길흉배열
	idx = ca02_actgdbad[0].lastIndexOf(hv3);
	hv8 = ca02_actgdbad[1][idx];  //--- 실행 길흉 
	sibsTugsin(hv3); hv3 = hs_titl; sibsTugsin(hv6); hv6 = hs_titl;
 	for (i=0; i<ca03_hunresult.length; i++){
 		if (ca03_hunresult[i][0]==hv3 && ca03_hunresult[i][1]==hv6){ hv9 = ca03_hunresult[i][2];};
 	};
	subj = hv3; temp = ca03a_unse.filter(isFind);
	idx = temp[0].lastIndexOf(hv6); 
	if (idx == 1){hv10 = temp[0][2] + "발흥 길";}else{	hv10 = ca03a_unse[1][idx];};
};

let tmpdb = new Array; let prc_hb = ""; let prc_ch = "";
//======= 천간 행운합충극 =======
async function ganhn(d){
	txt_ganhn = "";
	await ganhn0();
	tmpdb = $.map(ca10b_ghabch, function(element) {
		if (element[1] + element[2] + element[3] == code1){return [element]};
	});
	await dganhn();
	$(d).append(txt_ganhn);
};

//====== 천간(연간,월간,시간) 행운합
function ganhn0(){
	return new Promise(function (resolve, reject){
		for (i=1; i<5; i++){
			if (i == 3){continue;
			}else{sts = ""; hcg = ""; a = "";
				if (i == 1){sts = "연간"; hcg = hcg1; a = sj_yg;}; if (i == 2){sts = "월간"; hcg = hcg2; a = sj_mg;}; if (i == 4){sts = "시간"; hcg = hcg4; a = sj_tg;};
				for (j = 0; j < ca10a_ghabch.length; j++){
					if (ca10a_ghabch[j][0] == sts && ca10a_ghabch[j][1] == hcg && hcg == '-----'){
						for (k=6; k<10; k++){
							if (ganhc_nfo[i][k].includes("합")){
								cssn4 += 1; 
								txt_ganhn += '■ <span class = "spcs css_gw' + cssn4 + '">천간행운(' + sts + '합)--- ' + ganhc_nfo[0][k] + " " + ganhc_nfo[i][k] + " " + ca10a_ghabch[j][4] + '</span></br><div id = "css_gw' + cssn4 + '" class = "txca">';   //--- 행운에 의한 천간합 체크
								if (ca10a_ghabch[j][5] == "0"){summing0(a,"#output3");};  //--- 합화오행 육친십성 흉화(0) 
								txt_ganhn += "</div>--------------------------------------------------------------</br>";
							};
						};
					};
				};
			};
		};
		resolve();
	});
};

//====== 천간(일간) 행운합충극
function dganhn(){
	return new Promise(function (resolve, reject){
		let prac = "";  //-- let prad = ""; 
		if (ganhc_nfo[3][4].includes("합") || ganhc_nfo[3][4].includes("충")){prac += ganhc_nfo[3][4].substr(2);};
		if (ganhc_nfo[3][5].includes("합") || ganhc_nfo[3][5].includes("충")){prac += ganhc_nfo[3][5].substr(2);};  //--- 원국 "합충"

		for (i=6; i<10; i++){
			if (i == 6){sts = "대운";}; if (i == 7){sts = "연운";}; if (i == 8){sts = "월운";}; if (i == 9){sts = "일운";};
			xtt = ganhc_nfo[3][i].substr(2);  //--- 행운 xtt = "합","충"
			
			if (i == 6){
				if (xtt == "합" || xtt == "충"){prac += xtt;};
				sts += "(암시)";
			}else{
				if (prac != "" && prac.includes(xtt)){
					sts += "(실행)";
				}else{
					prac += xtt;
					sts += "(암시)";
				};
			};
			
			//--- 일간 행운
			code2 = "";
			if (xtt != ""){
				if (prac.includes(xtt)){ 
					idx = ca10b_ghabch[0].indexOf(xtt)+1; 
					code2 = tmpdb[0][idx]; 
					result_out(code2, ganhc_nfo[3][i] + " " + tmpdb[0][idx-1], sts, "#output3");  //--- 대운 일간합충 출력
				}else{
					prac += ganhc_nfo[3][i].substr(2);
				};
			};
			//--- 월간/시간 행운
			for (k=3; k<5; k++){l = 0; l = (k-2) * 2;
				code2 = ""; 	xtt = ganhc_nfo[l][i].substr(2,1); 
				if (xtt != ""){ 
					if (ganhc_nfo[3][k+1].substr(2,1) == "합" && ganhc_nfo[l][i].substr(2,1) == "합"){
						idx = ca10b_ghabch[0].indexOf("쟁")+1; code2 = tmpdb[0][idx]; 
						result_out(code2, "쟁 " + ganhc_nfo[l][i] + " " + tmpdb[0][idx-1], sts, "#output3");  //--- 행운 일간 (합봉 용봉 성합 합화) 출력
					};
					if (ganhc_nfo[3][k+1].substr(2,1) == "합" && ganhc_nfo[l][i].substr(2,1) == "충"){
						idx = ca10b_ghabch[0].indexOf(xtt)+1; code2 = tmpdb[0][idx]; 
						result_out(code2, ganhc_nfo[l][i] + " " + tmpdb[0][idx-1], sts, "#output3");  //--- 행운 일간 (합파 불합충) 출력
					};
					if (ganhc_nfo[3][k+1].substr(2,1) == "충" && (ganhc_nfo[l][i].substr(2,1) == "합" || ganhc_nfo[l][i].substr(2,1) == "극")){
						idx = ca10b_ghabch[0].indexOf(xtt)+1; code2 = tmpdb[0][idx]; 
						result_out(code2, ganhc_nfo[l][i] + " " + tmpdb[0][idx-1], sts, "#output3");  //--- 행운 일간 (충거) 출력
					};
					if (ganhc_nfo[3][k+1].substr(2,1) == "충" && ganhc_nfo[l][i].substr(2,1) == "충"){
						idx = ca10b_ghabch[0].indexOf(xtt)+1; code2 = tmpdb[0][idx]; 
						result_out(code2, "쟁 " + ganhc_nfo[l][i] + " " + tmpdb[0][idx-1], sts, "#output3");  //--- 행운 일간 (쟁충발) 출력
					};
				};
			};
		};
		resolve();
	});
};

//======= 십성 to 육신 변환 =======
function sibsTugsin(a){
	if (a == "비견" || a == "겁재"){	hs_titl = "비겁";
	}else{ if (a == "식신" || a == "상관"){	hs_titl = "식상";
		}else{ if (a == "편재" || a == "정재"){	hs_titl = "재성";
			}else{ if (a == "편관" || a == "정관"){	hs_titl = "관성";
				}else{ if (a == "편인" || a == "정인"){	hs_titl = "인성";	};};};};};
};

//■■■■■■■■■■■■■■■■■■■■
//======= 신살 description =======
let sinsaltxt = ""; let snsal = []; let sinsal_tlist = ""; let sinsalh_tlist = "";
function sinsal_out(csno, sinsaltxt, g, h, a, b){
	$("#"+csno).empty();
	snsal = sinsaltxt.split(" ");
	for (i=0; i<snsal.length; i++){
		if (snsal[i] != ""){
			subj = snsal[i]; temps1 = sinsal_gen.filter(isFindx); sinsal_nfo[g][h] += subj + " ";
			txt_sinsal += "◐ " + temps1[0][0] + "..... " ;
			if (temps1[0][1] != ""){txt_sinsal += temps1[0][1] + "</br>";};
			if (temps1[0][4] != ""){txt_sinsal += temps1[0][4] + "</br>";};
			if (temps1[0][2] != "" && gendr.substr(0,1) == "남"){txt_sinsal += temps1[0][2] + "</br>";};
			if (temps1[0][3] != "" && gendr.substr(0,1) == "여"){txt_sinsal += temps1[0][3] + "</br>";};
			if (subj=="원진"){wonjin("wn", g, h, a, b);}; if (subj=="귀문"){guimun("wn", g, h, a, b);}; 
		};
	};
};

//============ 원진 추가 =============
function wonjin(de, g, h, a, b){
	chkg(a,b); subj = rslt; temp = wonjn.filter(isFind); 
	if (de=="wn"){txt_sinsal += "♠ (" + subj + ")---" + temp[0][1] + "</br>";}; if (de=="hn"){txt_sinsalh += "♠ (" + subj + ")---" + temp[0][1] + "</br>";};
	sibsng(sj_dg,"",a); sibsTugsin(js_titl); subj = hs_titl; temp1 = wonjn.filter(isFind);
	if (de=="wn"){txt_sinsal += "♠ (" + subj + ")---" + temp1[0][1] + "</br>";}; if (de=="hn"){txt_sinsalh += "♠ (" + subj + ")---" + temp1[0][1] + "</br>";};
	sibsng(sj_dg,"",b); sibsTugsin(js_titl); subj = hs_titl; temp2 = wonjn.filter(isFind);
	if (de=="wn"){txt_sinsal += "♠ (" + subj + ")---" + temp2[0][1] + "</br>";}; if (de=="hn"){txt_sinsalh += "♠ (" + subj + ")---" + temp2[0][1] + "</br>";};
	if (g==5){subj="연지"}; if (g==6){subj="월지"}; if (g==7){subj="일지"}; if (g==8){subj="시지"}; temp3 = wonjn.filter(isFind);
	if (de=="wn"){txt_sinsal += "♠ (" + subj + ")---" + temp3[0][1] + "</br>";}; if (de=="hn"){txt_sinsalh += "♠ (" + subj + ")---" + temp3[0][1] + "</br>";};
	if (h==2){subj="연지"}; if (h==3){subj="월지"}; if (h==4){subj="일지"}; if (h==5){subj="시지"}; if (h>5){subj="행운"}; temp4 = wonjn.filter(isFind);
	if (de=="wn"){txt_sinsal += "♠ (" + subj + ")---" + temp4[0][1] + "</br>";}; if (de=="hn"){txt_sinsalh += "♠ (" + subj + ")---" + temp4[0][1] + "</br>";};
};

//============ 귀문 추가 =============
function guimun(de, g, h, a, b){
	chkg(a,b); subj = rslt; temp = gmun.filter(isFind); 
	if (de=="wn"){txt_sinsal += "♠ (" + subj + ")---" + temp[0][1] + "</br>";};
	sibsng(sj_dg,"",a); sibsTugsin(js_titl); aTus = hs_titl;
	sibsng(sj_dg,"",b); sibsTugsin(js_titl); bTus = hs_titl;
	if ((gendr == "남양" && (aTus=="재성" || bTus=="재성")) || (gendr == "여음" && (aTus=="관성" || bTus=="관성"))){
		if (de=="wn"){txt_sinsal += "♠ (" + gendr.substr(0,1) + ") " + hs_titl + "--- 배우자의 정신 횡포가 심함" + "</br>";};
		if (g==7 && h==5){
			if (de=="wn"){txt_sinsal += "♠ 일지-시지 & (" + gendr.substr(0,1) + ") " + hs_titl + " 귀문--- 배우자가 변태적 성향이 있으며 배우자가 성불감증인 경우가 많음" + "</br>";};
		};
	};
 	if (h>5){
 		sibsTugsin(hgj_nfo[h-5][7]); 
 		if (hs_titl=="관성" && gendr=="여음"){
 			if (de=="wn"){txt_sinsal += "♠ (" + gendr.substr(0,1) + ") " + hs_titl + "행운 귀문관살이 되면--- 부부별리" + "</br>";};
 		};
 	};
};

//======= 신살 체크00 =======
	let csno = ""; let cssn = 1;
function sinsal00(a,b,c,f,d,e,g,h){ //=== a: base, b: target, c: list, f: classcode, d: destin, e: destin2, g: base, h: target
	return new Promise(function (resolve, reject){
		//========== 배열 영역 (frames) ======================
		ttgt = ""; if (h==2){ttgt="연지";}; if (h==3){ttgt="월지";}; if (h==4){ttgt="일지";}; if (h==5){ttgt="시지";}; 
		let sslist = $.map(c, function(element, index) {
			if (element[13] == f) {
				return [element]
			};
		});
		subj = a; temp = sslist.filter(isFind); sinsaltxt = "";
		idx = c[0].lastIndexOf(b); sinsaltxt = temp[0][idx];
		if (sinsaltxt != ""){
			sinsal_tlist += sinsaltxt + " ";
			cssn += 1; csno = "css_a" + cssn;
			txt_sinsal += '■ <span class="spcs ' + csno + '">' + sinsaltxt + '</span>';
			txt_sinsal += '________ ' + a + '___ ' + b + '(' + ttgt + ')________ ' + f + '</br>';
			txt_sinsal += '<div id="' + csno + '" class="txca">';
			sinsal_out(csno, sinsaltxt, g, h, a, b);
			txt_sinsal += "</div>--------------------------------------------------------------</br>";
			document.getElementById(e).innerText += sinsaltxt + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======= 신살 체크02 ======= (태극귀인)
function sinsal02(a,b,c,f,d,e,g,h){ //=== a: base, b: target, c: list, f: classcode, d: destin, e: destin2, g: base수, h: target수
	return new Promise(function (resolve, reject){
		//========== 배열 영역 (frames) ======================
		ttgt = ""; if (h==2){ttgt="연지";}; if (h==3){ttgt="월지";}; if (h==4){ttgt="일지";}; if (h==5){ttgt="시지";}; 
		let sslist = $.map(c, function(element, index) {
			if (element[13] == f) {
				return [element]
			};
		});
		subj = a; temp = sslist.filter(isFind); sinsaltxt = "";
		idx = c[0].lastIndexOf(b); sinsaltxt = temp[0][idx];
		idx = c[0].lastIndexOf(sj_dj); bastxt = temp[0][idx];
		if (sinsaltxt != "" && bastxt == sinsaltxt){
			sinsal_tlist += sinsaltxt + " ";
			cssn += 1; csno = "css_a" + cssn;
			txt_sinsal += '■ <span class="spcs ' + csno + '">' + sinsaltxt + '</span>';
			txt_sinsal += '________ ' + a + '___ ' + b + '(' + ttgt + ')________ ' + f + '</br>';
			txt_sinsal += '<div id="' + csno + '" class="txca">';
			sinsal_out(csno, sinsaltxt, g, h, a, b);
			txt_sinsal += "</div>--------------------------------------------------------------</br>";
			document.getElementById(e).innerText += sinsaltxt + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======= 신살 조회 =======
async function sinsal(d){
	$(d).empty(); txt_sinsal = ""; sinsal_tlist = ""; cssn = 0; 
	txt_sinsal += "■■  (원국) 신살 _____ </br></br>"; 
	await sinsal02(sj_dg,sj_yj,sinsal_list1,"da00_dg_ydj",d,"ssal1",3,2); //--- 신살 체크0
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da01_dg_dtj",d,"ssal3",3,4); //--- 신살 체크1
	if (sjtx != "x"){await sinsal00(sj_dg,sj_tj,sinsal_list1,"da01_dg_dtj",d,"ssal4",3,5);}; //--- 신살 체크1
	await sinsal00(sj_dg,sj_yj,sinsal_list1,"da02_dg_jj",d,"ssal1",3,2); //--- 신살 체크2
	await sinsal00(sj_dg,sj_mj,sinsal_list1,"da02_dg_jj",d,"ssal2",3,3); //--- 신살 체크2
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da02_dg_jj",d,"ssal3",3,4); //--- 신살 체크2
	if (sjtx != "x"){await sinsal00(sj_dg,sj_tj,sinsal_list1,"da02_dg_jj",d,"ssal4",3,5);}; //--- 신살 체크2
	await sinsal00(sj_dg,sj_yj,sinsal_list1,"da03_dg_jj-dg_hlyj",d,"ssal1",3,2); //--- 신살 체크3
	await sinsal00(sj_dg,sj_mj,sinsal_list1,"da03_dg_jj-dg_hlyj",d,"ssal2",3,3); //--- 신살 체크3
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da03_dg_jj-dg_hlyj",d,"ssal3",3,4); //--- 신살 체크3
	if (sjtx != "x"){await sinsal00(sj_dg,sj_tj,sinsal_list1,"da03_dg_jj-dg_hlyj",d,"ssal4",3,5);}; //--- 신살 체크3
	await sinsal00(sj_dg,sj_mj,sinsal_list1,"da04_dg_mdtj",d,"ssal2",3,3); //--- 신살 체크4
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da04_dg_mdtj",d,"ssal3",3,4); //--- 신살 체크4
	if (sjtx != "x"){await sinsal00(sj_dg,sj_tj,sinsal_list1,"da04_dg_mdtj",d,"ssal4",3,5);}; //--- 신살 체크4
	if (sjtx != "x"){await sinsal00(sj_dg,sj_tj,sinsal_list1,"da05_dg_tj-dg_hj",d,"ssal4",3,5);}; //--- 신살 체크5
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da06_gj_dgj",d,"ssal3",3,4); //--- 신살 체크6
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da08_gj_dgj-hgj",d,"ssal3",3,4); //--- 신살 체크8
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da09_gj_dgj-ymtgj",d,"ssal3",3,4); //--- 신살 체크9
	if (sinsaltxt != ""){
		await sinsal00(sj_yg,sj_yj,sinsal_list1,"da09_gj_dgj-ymtgj",d,"ssal1",1,2); //--- 신살 체크9
		await sinsal00(sj_mg,sj_mj,sinsal_list1,"da09_gj_dgj-ymtgj",d,"ssal2",2,3); //--- 신살 체크9
		if (sjtx != "x"){await sinsal00(sj_tg,sj_tj,sinsal_list1,"da09_gj_dgj-ymtgj",d,"ssal4",4,5);}; //--- 신살 체크9
	};
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da10_gj_dtgj",d,"ssal3",3,4); //--- 신살 체크10
	if (sjtx != "x"){await sinsal00(sj_tg,sj_tj,sinsal_list1,"da10_gj_dtgj",d,"ssal4",4,5);}; //--- 신살 체크10
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da11_gj_gj",d,"ssal3",3,4); //--- 신살 체크11
	await sinsal00(sj_yg,sj_yj,sinsal_list1,"da11_gj_gj",d,"ssal1",1,2); //--- 신살 체크11
	await sinsal00(sj_mg,sj_mj,sinsal_list1,"da11_gj_gj",d,"ssal2",2,3); //--- 신살 체크11
	if (sjtx != "x"){await sinsal00(sj_tg,sj_tj,sinsal_list1,"da11_gj_gj",d,"ssal4",4,5);}; //--- 신살 체크11
	await sinsal00(sj_dg,sj_dj,sinsal_list1,"da12_gj_gj-hgj",d,"ssal3",3,4); //--- 신살 체크12
	await sinsal00(sj_yg,sj_yj,sinsal_list1,"da12_gj_gj-hgj",d,"ssal1",1,2); //--- 신살 체크12
	await sinsal00(sj_mg,sj_mj,sinsal_list1,"da12_gj_gj-hgj",d,"ssal2",2,3); //--- 신살 체크12
	if (sjtx != "x"){await sinsal00(sj_tg,sj_tj,sinsal_list1,"da12_gj_gj-hgj",d,"ssal4",4,5);}; //--- 신살 체크12
	//------------------------------
	await sinsal00(sj_dj,sj_yj,sinsal_list1,"db01_dj_jj-dj_hj",d,"ssal1",7,2); //--- 신살 체크1
	await sinsal00(sj_dj,sj_mj,sinsal_list1,"db01_dj_jj-dj_hj",d,"ssal2",7,3); //--- 신살 체크1
	await sinsal00(sj_dj,sj_dj,sinsal_list1,"db01_dj_jj-dj_hj",d,"ssal3",7,4); //--- 신살 체크1
	if (sjtx != "x"){await sinsal00(sj_dj,sj_tj,sinsal_list1,"db01_dj_jj-dj_hj",d,"ssal4",7,5);}; //--- 신살 체크1
	await sinsal00(sj_dj,sj_mj,sinsal_list1,"db02_dj_mtj-dj_hj",d,"ssal2",7,3); //--- 신살 체크2
	if (sjtx != "x"){await sinsal00(sj_dj,sj_tj,sinsal_list1,"db02_dj_mtj-dj_hj",d,"ssal4",7,5);}; //--- 신살 체크2
	await sinsal00(sj_dj,sj_yj,sinsal_list1,"db03_dj_ymtj",d,"ssal1",7,2); //--- 신살 체크3
	await sinsal00(sj_dj,sj_mj,sinsal_list1,"db03_dj_ymtj",d,"ssal2",7,3); //--- 신살 체크3
	if (sjtx != "x"){await sinsal00(sj_dj,sj_tj,sinsal_list1,"db03_dj_ymtj",d,"ssal4",7,5);}; //--- 신살 체크3
	await sinsal00(sj_dj,sj_yj,sinsal_list1,"db04_dj_ymtj-dj_hj",d,"ssal1",7,2); //--- 신살 체크4
	await sinsal00(sj_dj,sj_mj,sinsal_list1,"db04_dj_ymtj-dj_hj",d,"ssal2",7,3); //--- 신살 체크4
	if (sjtx != "x"){await sinsal00(sj_dj,sj_tj,sinsal_list1,"db04_dj_ymtj-dj_hj",d,"ssal4",7,5);}; //--- 신살 체크4
	await sinsal00(sj_dj,sj_yj,sinsal_list1,"db05_dj_ymtj-dj_hyj",d,"ssal1",7,2); //--- 신살 체크5
	await sinsal00(sj_dj,sj_mj,sinsal_list1,"db05_dj_ymtj-dj_hyj",d,"ssal2",7,3); //--- 신살 체크5
	if (sjtx != "x"){await sinsal00(sj_dj,sj_tj,sinsal_list1,"db05_dj_ymtj-dj_hyj",d,"ssal4",7,5);}; //--- 신살 체크5
	await sinsal00(sj_mj,sj_dj,sinsal_list1,"db06_mj_dtj",d,"ssal3",6,4); //--- 신살 체크6
	if (sjtx != "x"){await sinsal00(sj_mj,sj_tj,sinsal_list1,"db06_mj_dtj",d,"ssal4",6,5);}; //--- 신살 체크6
	await sinsal00(sj_mj,sj_yj,sinsal_list1,"db07_mj_ydtj",d,"ssal1",6,2); //--- 신살 체크7
	await sinsal00(sj_mj,sj_dj,sinsal_list1,"db07_mj_ydtj",d,"ssal3",6,4); //--- 신살 체크7
	if (sjtx != "x"){await sinsal00(sj_mj,sj_tj,sinsal_list1,"db07_mj_ydtj",d,"ssal4",6,5);}; //--- 신살 체크7
	await sinsal00(sj_mj,sj_yj,sinsal_list1,"db08_mj_ydtj-mj_hyj",d,"ssal1",6,2); //--- 신살 체크8
	await sinsal00(sj_mj,sj_dj,sinsal_list1,"db08_mj_ydtj-mj_hyj",d,"ssal3",6,4); //--- 신살 체크8
	if (sjtx != "x"){await sinsal00(sj_mj,sj_tj,sinsal_list1,"db08_mj_ydtj-mj_hyj",d,"ssal4",6,5);}; //--- 신살 체크8
	//------------------------------
	await sinsal00(sj_mj,sj_yg,sinsal_list2,"dc01_mj_gg",d,"ssal1",1,3); //--- 신살 체크1
	await sinsal00(sj_mj,sj_mg,sinsal_list2,"dc01_mj_gg",d,"ssal2",2,2); //--- 신살 체크1
	await sinsal00(sj_mj,sj_dg,sinsal_list2,"dc01_mj_gg",d,"ssal3",4,2); //--- 신살 체크1
	if (sjtx != "x"){await sinsal00(sj_mj,sj_tg,sinsal_list2,"dc01_mj_gg",d,"ssal4",4,3);}; //--- 신살 체크1
	await hyuncm(1,10); //--- 현침
	await pngdu(2,10); //--- 평두
	await chnrjm(3,10); //--- 천라지망
	await chsagm(4,10); //--- 철쇄개금
	await chmnsg(5,10); //--- 천문성
	await bogeum(6,10); //--- 복음
	await baneum(7,10); //--- 반음
	$(d).append(txt_sinsal);
	$(d).on("click", "span", function(){ 
		disp("#"+$(this).attr("class").substr(5),"",""); 
	}); 
};

//======== 평두 (신살) 체크 =========
let cntpd = 0; let cntpda = 0;
function pngdu(g, h){
	return new Promise(function (resolve, reject){
		resul = []; cntpd = 0; 
		resul = sj_ganji.match(/甲/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/丙/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/丁/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/壬/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/子/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/辰/g); if(resul != null) {cntpd += resul.length;};
		if (cntpd==3){cntpda = cntpd;};
		if (cntpd>3){
			sinsaltxt = "평두"; 
			sinsal_tlist += sinsaltxt + " ";
			cssn += 1; csno = "css_a" + cssn;
			txt_sinsal += '■ <span class="spcs ' + csno + '">' + sinsaltxt + '</span>';
			txt_sinsal += "________ 甲丙丁壬 子辰 _____4개↑___ </br>";
			txt_sinsal += '<div id="' + csno + '" class="txca">';
			sinsal_out(csno, sinsaltxt, g, h);
			txt_sinsal += "</div>--------------------------------------------------------------</br>";
			document.getElementById("ssal0").innerText += sinsaltxt + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======== 평두 (신살) 행운체크 =========
function pngduh(g, h){
	return new Promise(function (resolve, reject){
		cntpd = 0;
		if (cntpda==3){
			resul = []; cntpd = cntpda;
			resul = hn_ganji.match(/甲/g); if(resul != null) {cntpd += resul.length;};
			resul = hn_ganji.match(/丙/g); if(resul != null) {cntpd += resul.length;};
			resul = hn_ganji.match(/丁/g); if(resul != null) {cntpd += resul.length;};
			resul = hn_ganji.match(/壬/g); if(resul != null) {cntpd += resul.length;};
			resul = hn_ganji.match(/子/g); if(resul != null) {cntpd += resul.length;};
			resul = hn_ganji.match(/辰/g); if(resul != null) {cntpd += resul.length;};
		};
		if (cntpd>3){
			sinsaltxt1 = "평두"; 
			sinsalh_tlist += sinsaltxt1 + " ";
			cssn1 += 1; csno1 = "css_c" + cssn1;
			txt_sinsalh += '■ <span class="spct ' + csno1 + '">' + sinsaltxt1 + '</span>';
			txt_sinsalh += '________ 甲丙丁壬 子辰 _____4개↑___ </br>';
			txt_sinsalh += '<div id="' + csno1 + '" class="txcc">';
			sinsalhn_out(csno1, sinsaltxt1, g, h, a, b);
			txt_sinsalh += "</div>--------------------------------------------------------------</br>";
			document.getElementById("ssalb").innerText += sinsaltxt1 + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};	

//======== 현침 (신살) 체크 =========
function hyuncm(g, h){
	return new Promise(function (resolve, reject){
		resul = []; cntpd = 0; 
		resul = sj_ganji.match(/甲/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/辛/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/卯/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/午/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/未/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ganji.match(/申/g); if(resul != null) {cntpd += resul.length;};
		if (cntpd>1){
			sinsaltxt = "현침"; 
			sinsal_tlist += sinsaltxt + " ";
			cssn += 1; csno = "css_a" + cssn;
			txt_sinsal += '■ <span class="spcs ' + csno + '">' + sinsaltxt + '</span>';
			txt_sinsal += "________ 甲辛 卯午未申 _____2개↑___ </br>";
			txt_sinsal += '<div id="' + csno + '" class="txca">';
			sinsal_out(csno, sinsaltxt, g, h);
			txt_sinsal += "</div>--------------------------------------------------------------</br>";
			document.getElementById("ssal0").innerText += sinsaltxt + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======== 천라지망 (신살) 체크 =========
function chnrjm(g, h){
	return new Promise(function (resolve, reject){
		resul = []; cntpd = 0; 
		if ("戌亥辰巳".includes(sj_dj)){	
			resul = sj_ji.match(/戌/g); if(resul != null) {cntpd += resul.length;};
			resul = sj_ji.match(/亥/g); if(resul != null) {cntpd += resul.length;};
			resul = sj_ji.match(/辰/g); if(resul != null) {cntpd += resul.length;};
			resul = sj_ji.match(/巳/g); if(resul != null) {cntpd += resul.length;};
		};
		if (cntpd>1){
			sinsaltxt = "천라지망"; 
			sinsal_tlist += sinsaltxt + " ";
			cssn += 1; csno = "css_a" + cssn;
			txt_sinsal += '■ <span class="spcs ' + csno + '">' + sinsaltxt + '</span>';
			txt_sinsal += "________ 戌亥辰巳 _____2개↑___ </br>";
			txt_sinsal += '<div id="' + csno + '" class="txca">';
			sinsal_out(csno, sinsaltxt, g, h);
			txt_sinsal += "</div>--------------------------------------------------------------</br>";
			document.getElementById("ssal0").innerText += sinsaltxt + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======== 천라지망 (신살) 행운체크 =========
function chnrjmh(g, h){
	return new Promise(function (resolve, reject){
		resul = []; cntpd = 0; 
		if ("戌亥辰巳".includes(sj_dj)){	
			resul = hn_ganji.match(/戌/g); if(resul != null) {cntpd += resul.length;};
			resul = hn_ganji.match(/亥/g); if(resul != null) {cntpd += resul.length;};
			resul = hn_ganji.match(/辰/g); if(resul != null) {cntpd += resul.length;};
			resul = hn_ganji.match(/巳/g); if(resul != null) {cntpd += resul.length;};
		}
		if (cntpd>0){
			sinsaltxt1 = "천라지망"; 
			sinsalh_tlist += sinsaltxt1 + " ";
			cssn1 += 1; csno1 = "css_c" + cssn1;
			txt_sinsalh += '■ <span class="spct ' + csno1 + '">' + sinsaltxt1 + '</span>';
			txt_sinsalh += '________ 戌亥辰巳 _____2개↑(일지포함)___ </br>';
			txt_sinsalh += '<div id="' + csno1 + '" class="txcc">';
			sinsalhn_out(csno1, sinsaltxt1, g, h, a, b);
			txt_sinsalh += "</div>--------------------------------------------------------------</br>";
			document.getElementById("ssalb").innerText += sinsaltxt1 + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======== 철쇄개금 (신살) 체크 =========
function chsagm(g, h){
	return new Promise(function (resolve, reject){
		resul = []; cntpd = 0; 
		if ("卯酉戌".includes(sj_dj)){	
			resul = sj_ji.match(/卯/g); if(resul != null) {cntpd += resul.length;};
			resul = sj_ji.match(/酉/g); if(resul != null) {cntpd += resul.length;};
			resul = sj_ji.match(/戌/g); if(resul != null) {cntpd += resul.length;};
		};
		if (cntpd>1){
			sinsaltxt = "철쇄개금"; 
			sinsal_tlist += sinsaltxt + " ";
			cssn += 1; csno = "css_a" + cssn;
			txt_sinsal += '■ <span class="spcs ' + csno + '">' + sinsaltxt + '</span>';
			txt_sinsal += "________ 卯酉戌 _____2개↑___ </br>";
			txt_sinsal += '<div id="' + csno + '" class="txca">';
			sinsal_out(csno, sinsaltxt, g, h);
			txt_sinsal += "</div>--------------------------------------------------------------</br>";
			document.getElementById("ssal0").innerText += sinsaltxt + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======== 천문성(天門星) (신살) 체크 =========
function chmnsg(g, h){
	return new Promise(function (resolve, reject){
		resul = []; cntpd = 0; 
		resul = sj_ji.match(/未/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ji.match(/戌/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ji.match(/卯/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ji.match(/亥/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ji.match(/寅/g); if(resul != null) {cntpd += resul.length;};
		resul = sj_ji.match(/酉/g); if(resul != null) {cntpd += resul.length;};
		if (cntpd>1 || sj_ji.includes("亥")){
			sinsaltxt = "천문성"; 
			sinsal_tlist += sinsaltxt + " ";
			cssn += 1; csno = "css_a" + cssn;
			txt_sinsal += '■ <span class="spcs ' + csno + '">' + sinsaltxt + '</span>';
			txt_sinsal += "________ 未戌卯亥寅酉 _____2개↑(戌亥는 1개↑)___ </br>";
			txt_sinsal += '<div id="' + csno + '" class="txca">';
			sinsal_out(csno, sinsaltxt, g, h);
			txt_sinsal += "</div>--------------------------------------------------------------</br>";
			document.getElementById("ssal0").innerText += sinsaltxt + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======== 복음 (신살) 체크 =========
function bogeum(g, h){
	return new Promise(function (resolve, reject){
		sj_ymtgj = sj_ganji.substr(0,4) + sj_ganji.substr(6)
		if (sj_ymtgj.includes(sj_dg+sj_dj)){
			sinsaltxt = "복음"; 
			sinsal_tlist += sinsaltxt + " ";
			cssn += 1; csno = "css_a" + cssn;
			txt_sinsal += '■ <span class="spcs ' + csno + '">' + sinsaltxt + '</span>';
			txt_sinsal += "________ 일주간지 원국중첩 ________ </br>";
			txt_sinsal += '<div id="' + csno + '" class="txca">';
			sinsal_out(csno, sinsaltxt, g, h);
			txt_sinsal += "</div>--------------------------------------------------------------</br>";
			document.getElementById("ssal0").innerText += sinsaltxt + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======== 복음 (신살) 행운체크 =========
function bogeumh(g, h){
	return new Promise(function (resolve, reject){
		if (hn_ganji.includes(sj_dg+sj_dj)){
			sinsaltxt1 = "복음"; dest = "";
			sinsalh_tlist += sinsaltxt1 + " ";
			cssn1 += 1; csno1 = "css_c" + cssn1;
			txt_sinsalh += '■ <span class="spct ' + csno1 + '">' + sinsaltxt1 + '</span>';
			txt_sinsalh += '________ 일주간지 행운중첩 ________ </br>';
			txt_sinsalh += '<div id="' + csno1 + '" class="txcc">';
			sinsalhn_out(csno1, sinsaltxt1, g, h, a, b);
			txt_sinsalh += "</div>--------------------------------------------------------------</br>";
			if (hn_lg+hn_lj == sj_dg+sj_dj){dest="hunL3"}; if (hn_yg+hn_yj == sj_dg+sj_dj){dest="hunY3"}; 
			if (hn_mg+hn_mj == sj_dg+sj_dj){dest="hunM3"}; if (hn_dg+hn_dj == sj_dg+sj_dj){dest="hunD3"}; 
			document.getElementById(dest).innerText += sinsaltxt1 + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======== 반음(천충지충) (신살) 체크 =========
function baneum(g, h){
	return new Promise(function (resolve, reject){
		if ((ganhc_nfo[2][4].includes("충") && jjhc_nfo[2][4].includes("충")) || (ganhc_nfo[4][5].includes("충") && jjhc_nfo[4][3].includes("충"))){
			sinsaltxt = "반음"; 
			sinsal_tlist += sinsaltxt + " ";
			cssn += 1; csno = "css_a" + cssn;
			txt_sinsal += '■ <span class="spcs ' + csno + '">' + sinsaltxt + '</span>';
			txt_sinsal += "________ 일주 원국 천충지충 ________ </br>";
			txt_sinsal += '<div id="' + csno + '" class="txca">';
			sinsal_out(csno, sinsaltxt, g, h);
			txt_sinsal += "</div>--------------------------------------------------------------</br>";
			document.getElementById("ssal0").innerText += sinsaltxt + "\n";  //----- 화면 신살란 기록
		};
		resolve();
	});
};

//======== 반음(천충지충) (신살) 행운체크 =========
function baneumh(g, h){
	return new Promise(function (resolve, reject){
		for (m=6; m<10; m++){
			if (ganhc_nfo[3][m].includes("충") && jjhc_nfo[3][m].includes("충")){
				sinsaltxt1 = "반음"; dest = "";
				sinsalh_tlist += sinsaltxt1 + " ";
				cssn1 += 1; csno1 = "css_c" + cssn1;
				txt_sinsalh += '■ <span class="spct ' + csno1 + '">' + sinsaltxt1 + '</span>';
				txt_sinsalh += '________ 일주 행운 천충지충 ________ </br>';
				txt_sinsalh += '<div id="' + csno1 + '" class="txcc">';
				sinsalhn_out(csno1, sinsaltxt1, g, h, a, b);
				txt_sinsalh += "</div>--------------------------------------------------------------</br>";
				if (m==6){dest="hunL3"}; if (m==7){dest="hunY3"}; if (m==8){dest="hunM3"}; if (m==9){dest="hunD3"}; 
				document.getElementById(dest).innerText += sinsaltxt1 + "\n";  //----- 화면 신살란 기록
			};
		};
		resolve();
	});
};

//======== 남(재관) 여(관식) 파악하기 =========
function jagns(a,b){  //--- a: /편재/g, /정재/g 등  b: "편재"
	rr = sstext.match(a);
	if (rr==null){
		sstext1 = gj_nfo[1][12] + gj_nfo[1][13] + gj_nfo[1][14] + gj_nfo[2][12] + gj_nfo[2][13] + gj_nfo[2][14] + gj_nfo[3][12] + gj_nfo[3][13] + gj_nfo[3][14] + gj_nfo[4][12] + gj_nfo[4][13] + gj_nfo[4][14]; 
		rr1 = sstext1.match(a);
	}else{
		ai = parseInt(sstext.indexOf(b)/3)+1;
	};
};

//======================
function spclcarac1(dx){
	txt_wmix = ""; mpx1 = 0; mpx2 = 0; mpx3 = 0;
	txt_wmix += "■■  나는 어떤 사람인가? </br></br>";
	//--- 음양 특성 출력(outputx) 
	if (gj_nfo[3][2].substr(0,1)=="음"){mptxt = o_hang[3][0];};
	if (gj_nfo[3][2].substr(0,1)=="양"){mptxt = o_hang[2][0];};

	//--- 일간 특성 출력(outputx) 
	subj = sj_dg; temps0 = b_ilgan.filter(isFind); 
	txt_wmix += "■ 1 일간: </br>"; 
	txt_wmix += "◐ 음양: "; 
	txt_wmix += '<span class="spcs css_x0">' + mptxt.substr(0,1) + ' (' + mptxt.substr(1,1) + ') ' + mptxt.substr(2) + '</span></br><div id="css_x0" class="txcb">* 성격(내적): ' + b_ilgan[temps0[0][4]][2] + '</div>--------------------------------------------------------------</br>';

	txt_wmix += "◐ 일간: "; 
	txt_wmix += '<span class="spcs css_x1">' + subj + '__ ' + temps0[0][1] + '</span></br><div id="css_x1" class="txcb">* 성격(내적): ' + temps0[0][2] + '</div>--------------------------------------------------------------</br>';

	//--- 월지십성 특성 출력(outputx) 
	sibsng(sj_dg,"",sj_mj); subj = js_titl; temps0 = b_ssmj.filter(isFind);
	txt_wmix += "■ 2 월지: </br>";
	txt_wmix += '◐ 십성: <span class="spcs css_x2">' + subj + "__ " + sj_dg + sj_mj + '</span></br><div id="css_x2" class="txcb">* 성격(외적): ' + temps0[0][1];
	txt_wmix += '</div>--------------------------------------------------------------</br>';

	//--- 간섭인자(합충형)에 따른 성격 출력(outputx) 
	txg = hcg1 + hcg3;
	txj = jjhc_nfo[1][2] + jjhc_nfo[2][2] + jjhc_nfo[3][2] + jjhc_nfo[4][2];
	if ((txg+txj).includes("합") || (txg+txj).includes("충") || (txg+txj).includes("형")){
		txt_wmix += "■ 3 합충형: </br>";
		if (txg.includes("합") || txj.includes("합")){
			if (txg.includes("합") && txj.includes("합")){ mpx1 = 3;}else{ mpx1 = 2;};
			txt_wmix += '◐ <span class="spcs css_x3">' + b_ilgan[13][0] + "__ " + b_ilgan[13][4] + '</span></br><div id="css_x3" class="txcb">* 성격: ' + b_ilgan[13][mpx1] + '</div>--------------------------------------------------------------</br>';
		};
		if (txg.includes("충")){ mpx2 = 2;}; if (txj.includes("충")){ mpx2 = 3;};			
		if (mpx2>0){
			txt_wmix += '◐ <span class="spcs css_x4">' + b_ilgan[14][0] + "__ " + b_ilgan[14][4] + '</span></br><div id="css_x4" class="txcb">* 성격: ' + b_ilgan[14][mpx2] + '</div>--------------------------------------------------------------</br>';
		};
		if (txj.includes("형")){
			if(pn != null) {
				if (pn.length>=2){ mpx3 = 2;	}else{	mpx3 = 3;};
			}else{	mpx3 = 3;};
			txt_wmix += '◐ <span class="spcs css_x5">' + b_ilgan[15][0] + "__ " + b_ilgan[15][4] + '</span></br><div id="css_x5" class="txcb">* 성격: ' + b_ilgan[15][mpx3] + '</div>--------------------------------------------------------------</br>';
		};
	};

	//--- 없는것 특성 출력(outputx) 
	if ((ohtx.match(/목/g) || []).length==0 || (ohtx.match(/화/g) || []).length==0 || (ohtx.match(/토/g) || []).length==0 || (ohtx.match(/금/g) || []).length==0 || (ohtx.match(/수/g) || []).length==0){
		txt_wmix += "■ 4 원국에 없는것: </br>";
		txt_wmix += "◐ 오행: </br>"; 
		if ((ohtx.match(/목/g) || []).length==0){	txt_wmix += '* <span class="spcs css_x6">' + b_nohng[1][0] + '</span><div id="css_x6" class="txcb">: ' + b_nohng[1][1] + '</div>';};
		if ((ohtx.match(/화/g) || []).length==0){	txt_wmix += '* <span class="spcs css_x7">' + b_nohng[2][0] + '</span><div id="css_x7" class="txcb">: ' + b_nohng[2][1] + '</div>';};
		if ((ohtx.match(/토/g) || []).length==0){	txt_wmix += '* <span class="spcs css_x8">' + b_nohng[3][0] + '</span><div id="css_x8" class="txcb">: ' + b_nohng[3][1] + '</div>';};
		if ((ohtx.match(/금/g) || []).length==0){	txt_wmix += '* <span class="spcs css_x9">' + b_nohng[4][0] + '</span><div id="css_x9" class="txcb">: ' + b_nohng[4][1] + '</div>';};
		if ((ohtx.match(/수/g) || []).length==0){	txt_wmix += '* <span class="spcs css_x10">' + b_nohng[5][0] + '</span><div id="css_x10" class="txcb">: ' + b_nohng[5][1] + '</div>';};
		if (gendr.substr(0,1)=="남"){ txt_wmix += '</br>* 남자: ' + b_nohng[6][1] + '</br>';}; if (gendr.substr(0,1)=="여"){ txt_wmix += '</br>* 여자: ' + b_nohng[7][1] + '</br>';};
		txt_wmix += '--------------------------------------------------------------</br>'; 
	};
	txt_wmix += "◐ 십성: </br>"; 
	if ((sstext.match(/비견/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xa">' + b_noss[1][0] + '</span><div id="css_xa" class="txcb">: ' + b_noss[1][1] + '</div>';};
	if ((sstext.match(/겁재/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xb">' + b_noss[2][0] + '</span><div id="css_xb" class="txcb">: ' + b_noss[2][1] + '</div>';};
	if ((sstext.match(/식신/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xc">' + b_noss[3][0] + '</span><div id="css_xc" class="txcb">: ' + b_noss[3][1] + '</div>';};
	if ((sstext.match(/상관/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xd">' + b_noss[4][0] + '</span><div id="css_xd" class="txcb">: ' + b_noss[4][1] + '</div>';};
	if ((sstext.match(/편재/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xe">' + b_noss[5][0] + '</span><div id="css_xe" class="txcb">: ' + b_noss[5][1] + '</div>';};
	if ((sstext.match(/정재/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xf">' + b_noss[6][0] + '</span><div id="css_xf" class="txcb">: ' + b_noss[6][1] + '</div>';};
	if ((sstext.match(/편관/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xg">' + b_noss[7][0] + '</span><div id="css_xg" class="txcb">: ' + b_noss[7][1] + '</div>';};
	if ((sstext.match(/정관/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xh">' + b_noss[8][0] + '</span><div id="css_xh" class="txcb">: ' + b_noss[8][1] + '</div>';};
	if ((sstext.match(/편인/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xi">' + b_noss[9][0] + '</span><div id="css_xi" class="txcb">: ' + b_noss[9][1] + '</div>';};
	if ((sstext.match(/정인/g) || []).length==0){	txt_wmix += '* <span class="spcs css_xj">' + b_noss[10][0] + '</span><div id="css_xj" class="txcb">: ' + b_noss[10][1] + '</div>';};
	txt_wmix += '</br>--------------------------------------------------------------</br>'; 

	//--- 많은것 특성 출력(outputx) 
	txt_wmix += "■ 5 원국에 많은것: </br>";
	txt_wmix += "◐ 오행: </br>"; 
	if ((ohtx.match(/목/g) || []).length>1){	txt_wmix += '* <span class="spcs css_xk">' + b_mohng[1][0] + '</span><div id="css_xk" class="txcb">: ' + b_mohng[1][2] + '</br>' + b_mohng[1][1] + '</div>';};
	if ((ohtx.match(/화/g) || []).length>1){	txt_wmix += '* <span class="spcs css_xl">' + b_mohng[2][0] + '</span><div id="css_xl" class="txcb">: ' + b_mohng[2][2] + '</br>' + b_mohng[2][1] + '</div>';};
	if ((ohtx.match(/토/g) || []).length>1){	txt_wmix += '* <span class="spcs css_xm">' + b_mohng[3][0] + '</span><div id="css_xm" class="txcb">: ' + b_mohng[3][2] + '</br>' + b_mohng[3][1] + '</div>';};
	if ((ohtx.match(/금/g) || []).length>1){	txt_wmix += '* <span class="spcs css_xn">' + b_mohng[4][0] + '</span><div id="css_xn" class="txcb">: ' + b_mohng[4][2] + '</br>' + b_mohng[4][1] + '</div>';};
	if ((ohtx.match(/수/g) || []).length>1){	txt_wmix += '* <span class="spcs css_xo">' + b_mohng[5][0] + '</span><div id="css_xo" class="txcb">: ' + b_mohng[5][2] + '</br>' + b_mohng[5][1] + '</div>';};
	txt_wmix += '</br>--------------------------------------------------------------</br>'; 
	txt_wmix += "◐ 육친: </br>"; 
	if (((sstext.match(/비견/g) || []).length + (sstext.match(/겁재/g) || []).length)>1){txt_wmix += '* <span class="spcs css_xp">' + b_moss[1][0] + '</span><div id="css_xp" class="txcb">: ' + b_moss[1][1] + '</div>';};
	if (((sstext.match(/식신/g) || []).length + (sstext.match(/상관/g) || []).length)>1){txt_wmix += '* <span class="spcs css_xq">' + b_moss[2][0] + '</span><div id="css_xq" class="txcb">: ' + b_moss[2][1] + '</div>';};
	if (((sstext.match(/편재/g) || []).length + (sstext.match(/정재/g) || []).length)>1){txt_wmix += '* <span class="spcs css_xr">' + b_moss[3][0] + '</span><div id="css_xr" class="txcb">: ' + b_moss[3][1] + '</div>';};
	if (((sstext.match(/편관/g) || []).length + (sstext.match(/정관/g) || []).length)>1){txt_wmix += '* <span class="spcs css_xs">' + b_moss[4][0] + '</span><div id="css_xs" class="txcb">: ' + b_moss[4][1] + '</div>';};
	if (((sstext.match(/편인/g) || []).length + (sstext.match(/정인/g) || []).length)>1){txt_wmix += '* <span class="spcs css_xt">' + b_moss[5][0] + '</span><div id="css_xt" class="txcb">: ' + b_moss[5][1] + '</div>';};
	txt_wmix += '</br>--------------------------------------------------------------</br>'; 

	//--- 근묘화실 출력(outputx) *************************  new version
	txt_wmix += "■ new 6 근묘화실: </br>";  
	if (gendr.substr(0,1)=="남"){ gnd_n = 2;}; if (gendr.substr(0,1)=="여"){ gnd_n = 3;};
	for (i=1; i<5; i++){
		if (i==1){ txt_wmix += '* 20세이전 소년기의 어린 시절에는 ';};
		if (i==2){ txt_wmix += '* 20-40세 청년기의 환경적요소.직업.부모.형제 문제는 ';};
		if (i==3){ txt_wmix += '* 40-60세 장년기의 배우자와 가족문제는 ';};
		if (i==4){ txt_wmix += '* 60-80세 말년기의 부모.자녀문제는 ';};
		nnr = (i-1)*4;
		if (i != 3){
			r_id = b_ymdtss2[0].indexOf(gj_nfo[i][3]); 	 
			if (b_ymdtss2[nnr+1][r_id] !=""){txt_wmix += '* ' + b_ymdtss2[nnr+1][r_id] + '</br>';};
			if (b_ymdtss2[nnr+gnd_n][r_id] !=""){txt_wmix += '* ' + b_ymdtss2[nnr+gnd_n][r_id] + '</br>';};
		};
		r_id = b_ymdtss2[0].indexOf(gj_nfo[i][7]); 	
		if (b_ymdtss2[nnr+1][r_id] !=""){txt_wmix += '* ' + b_ymdtss2[nnr+1][r_id] + '</br>';};
		if (b_ymdtss2[nnr+gnd_n][r_id] !=""){txt_wmix += '* ' + b_ymdtss2[nnr+gnd_n][r_id] + '</br>';};
	};
	txt_wmix += '--------------------------------------------------------------</br>';

	//--- 근묘화실 출력(outputx) 
	txt_wmix += "■ 6 근묘화실: </br>";
	txt_wmix += '* ' + b_ymdtss[12][1] + '</br>'; 
	subj = gj_nfo[1][3]; temps0 = b_ymdtss.filter(isFind);
	txt_wmix += '◐ <span class="spcs css_y1">' + subj + '</span></br><div id="css_y1" class="txcb">- ' + temps0[0][1] + '</div>';
	subj = gj_nfo[1][7]; temps0 = b_ymdtss.filter(isFind);
	txt_wmix += '◐ <span class="spcs css_y2">' + subj + '</span></br><div id="css_y2" class="txcb">- ' + temps0[0][1] + '</div>--------------------------------------------------------------</br>';
	txt_wmix += '* ' + b_ymdtss[12][2] + '</br>'; 
	subj = gj_nfo[2][3]; temps0 = b_ymdtss.filter(isFind);
	txt_wmix += '◐ <span class="spcs css_y3">' + subj + '</span></br><div id="css_y3" class="txcb">- ' + temps0[0][2] + '</div>';
	subj = gj_nfo[2][7]; temps0 = b_ymdtss.filter(isFind);
	txt_wmix += '◐ <span class="spcs css_y4">' + subj + '</span></br><div id="css_y4" class="txcb">- ' + temps0[0][2] + '</div>--------------------------------------------------------------</br>';
	txt_wmix += '* ' + b_ymdtss[12][3] + '</br>'; 
	subj = gj_nfo[3][7]; temps0 = b_ymdtss.filter(isFind);
	txt_wmix += '◐ <span class="spcs css_y5">' + subj + '</span></br><div id="css_y5" class="txcb">- ' + temps0[0][3] + '</div>--------------------------------------------------------------</br>';
	txt_wmix += '* ' + b_ymdtss[12][4] + '</br>'; 
	subj = gj_nfo[4][3]; temps0 = b_ymdtss.filter(isFind);
	txt_wmix += '◐ <span class="spcs css_y6">' + subj + '</span></br><div id="css_y6" class="txcb">- ' + temps0[0][4] + '</div>';
	subj = gj_nfo[4][7]; temps0 = b_ymdtss.filter(isFind);
	txt_wmix += '◐ <span class="spcs css_y7">' + subj + '</span></br><div id="css_y7" class="txcb">- ' + temps0[0][4] + '</div>--------------------------------------------------------------</br>';

	//--- 직업 출력(outputx) 
	txt_wmix += "■ 7 직업: </br>";

	$(dx).append(txt_wmix);
	$(dx).on("click", "span", function(){ 
		disp("#"+$(this).attr("class").substr(5),"",""); 
	}); 
};

//======================
function spclcarac2(d){
	txt_wmiy = ""; 
	if (gendr === "남양"){ n_gen = 3;}; if (gendr === "여음"){ n_gen = 4;};
	txt_wmiy += "■■  나는 어떤 사람인가? </br></br>";

	//--- 음양 특성 출력(output0) 
	if (gj_nfo[3][2].substr(0,1)=="음"){mptxt = o_hang[3][0];};
	if (gj_nfo[3][2].substr(0,1)=="양"){mptxt = o_hang[2][0];};
	if(pn != null) {
		if (pn.length>=2){mptxt += "신강" + "행동 지향적. 미래가치 중시. 외향 능동적. 명분(기세 의리) 중시. 팽창 발산 상승 단단함"; mptx1 = 11;	}else{	mptxt += "신약" + "사고 지향적. 현재가치 중시. 내향 수동적. 실리(힘 세력) 중시. 수축 수렴 하강 부드러움"; mptx1 = 12;};
	}else{	mptxt += "신약" + "사고 지향적. 현재가치 중시. 내향 수동적. 실리(힘 세력) 중시. 수축 수렴 하강 부드러움"; mptx1 = 12;};

	if (gendr.substr(0,1)=="남"){mptx2 = 5;}; 
	if (gendr.substr(0,1)=="여"){mptx2 = 6;}; 

	txt_wmiy += "■ 1 음양: "; 
	txt_wmiy += '<span class="spcs css_b0">' + mptxt.substr(0,1) + ' (' + mptxt.substr(1,1) + ') ' + mptxt.substr(2,2) + '</span></br><div id="css_b0" class="txcb">--> ⊙ ' + mptxt.substr(4) + '</br></br>◐ 성격: ' + a_ilgan[mptx1][2] + '</br>◐ 심리: ' + a_ilgan[mptx1][3] + '</br>◐ 직업: ' + a_ilgan[mptx1][4] + '</br>◐ 이성관: ' + a_ilgan[mptx1][mptx2] + '</div>--------------------------------------------------------------</br></br>';

	//--- 일주론 출력(output0) 
	ilj = sj_dg + sj_dj; 
	lsts = $.map(a_ilju2, function(element, index) {  //--- 부분배열 (일주data)
	  if (element[0] == ilj) {
		return [element]
	  };
	});
	
	let txt_tts = "";
	txt_tts += "■ 2 일주: ";
	txt_tts += '<span class="spcs css_b6">' + ilj + '</span></br><div id="css_b6" class="txcb">';
	t_itm = ["항목", "특성", "육친", "학업", "결혼", "직업", "특징", "물상", "신살", "요약", "성", "질병", "직업군", "해석"];

	//----------- 조건식 코딩 작성 ----------- 

	for (i=0; i<lsts.length; i++){
		if (lsts[i][1].includes("10")){  //--- 10번항목 skip
			continue; 
		}else{
			if (i!==0 && lsts[i][1].substr(0,2)!==lsts[i-1][1].substr(0,2)){	txt_tts += '</br>--------------------------------------------------------------';	};
			if (lsts[i][1]==="13"){ txt_tts += ' </br>' }else{ if (lsts[i][1].length===2){ txt_tts += '</br> ◐ ' + t_itm[Number(lsts[i][1])] + ': </br>' };};
			txt_tts += lsts[i][2];
			if (lsts[i][n_gen] !==""){ txt_tts += '</br>--->⊙ ' + lsts[i][n_gen]; };
		};
	};

	txt_wmiy += txt_tts;
	txt_wmiy += '</div>--------------------------------------------------------------</br>';
	$(d).append(txt_wmiy);
	$(d).on("click", "span", function(){ 
		disp("#"+$(this).attr("class").substr(5),"",""); 
	}); 
};

