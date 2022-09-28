window.GetThinh = GetThinh;
export function GetThinh(){
    var r = randomIntFromInterval(0, thinh.length-1);
    return thinh[r];
}

function randomIntFromInterval(min, max) { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const thinh = [
    "Yêu em"
    ,"Em có muốn con mình sau này có ADN của anh không?"
    ,"Bé ơi trà sữa anh mời <br/>Uống xong nhớ phải nhận lời yêu anh."
    ,"Đi đi kẻo lỡ đèn xanh <br/>Yêu đi kẻo lỡ tình anh bây giờ."
    ,"Anh yêu em như Bác Hồ yêu nước <br/>Mất em rồi anh như Pháp mất Đông Dương."
    ,"Chào em cô gái tên Minh <br/>Liệu Minh có muốn hai mình đêm nay"
    ,"Trăng lên đỉnh núi trăng tà <br/>Hỏi rằng em đã ăn gì chưa em?"
    ,"Anh mất ngủ chẳng phải do trà <br/>Suy đi nghĩ lại chắc là nhớ em"
    ,"Anh như quả trứng 2 lòng <br/>Một lòng yêu nước một lòng yêu em"
    ,"Anh như quả trứng 2 lòng <br/>Một lòng yêu nước một lòng yêu em"
    ,"Cho anh một cốc trà đào<br/>Tiện cho anh hỏi lối vào tim em?"
    ,"Vector chỉ có một chiều<br/> Còn anh chuyên lý chỉ yêu 1 người."
    ,"Nắng mưa là chuyện của trời <br/>Tương tư là chuyện của tôi yêu nàng."
    ,"Quyết nhịn tiêu từ giờ đến Tết<br/>Để dành tiền mua hết trái tim em."
    ,"Người ta dệt mộng bằng thơ<br/>Còn tôi dệt mộng bằng bờ môi em."
    ,"Hoa rơi cửa Phật<br/>Lật đật nửa đêm"
    ,"Tình yêu như món thịt gà<br/>Người trẻ háo hức, người già chê dai"
    ," Tình yêu như lốp với săm<br/>Săm mà bị hỏng lốp nằm với ai?"
    ,"Muốn chua thì thêm dấm <br/>Muốn êm ấm thì yêu anh."
];

let thi = document.getElementById("thinh");
thi.innerHTML = GetThinh();

let thinhBtn = document.getElementById("thinh-btn").addEventListener("click", function() {
    thi.innerHTML = GetThinh();
});