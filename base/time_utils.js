function formatTimeDiff(seconds, lang = "en") {
    let diff = Math.abs(seconds < 1000000000 ? seconds : new Date().getTime() / 1000 - seconds)
    let diffStr = formatTimeDiffStr(Math.abs(diff), lang)
    if (diff > 0)
    return diffStr;
    lang = lang.toLowerCase()
    if (lang === "ru") return (diffStr + " назад").toLowerCase()
    if (lang === "zh") return (diffStr + "前").toLowerCase()
    if (lang === "hi") return (diffStr + " पहले").toLowerCase()
    if (lang === "es") return ("hace " + diffStr).toLowerCase()
    if (lang === "fr") return ("il y a " + diffStr).toLowerCase()
    if (lang === "ar") return ("منذ " + diffStr).toLowerCase()
    if (lang === "bn") return (diffStr + " আগে").toLowerCase()
    if (lang === "pt") return (diffStr + " atrás").toLowerCase()
    if (lang === "id") return (diffStr + " yang lalu").toLowerCase()
    if (lang === "ur") return (diffStr + " پہلے").toLowerCase()
    if (lang === "de") return ("vor " + diffStr).toLowerCase()
    if (lang === "ja") return (diffStr + "前").toLowerCase()
    if (lang === "sw") return (diffStr + " iliyopita").toLowerCase()
    if (lang === "mr") return (diffStr + " पूर्वी").toLowerCase()
    if (lang === "te") return (diffStr + " ముందు").toLowerCase()
    if (lang === "tr") return (diffStr + " önce").toLowerCase()
    if (lang === "ta") return (diffStr + " முன்பு").toLowerCase()
    if (lang === "vi") return (diffStr + " trước").toLowerCase()
    if (lang === "ko") return (diffStr + " 전").toLowerCase()
    if (lang === "fa") return ("قبل " + diffStr).toLowerCase()
    if (lang === "it") return ("fa " + diffStr).toLowerCase()
    if (lang === "th") return (diffStr + " ที่ผ่านมา").toLowerCase()
    if (lang === "gu") return (diffStr + " માટે").toLowerCase()
    if (lang === "kn") return (diffStr + " ಮೂಲಕ").toLowerCase()
    if (lang === "pa") return (diffStr + " ਪਹਿਲਾਂ").toLowerCase()
    if (lang === "ms") return (diffStr + " yang lalu").toLowerCase()
    if (lang === "or") return (diffStr + " ପୂର୍ବେ").toLowerCase()
    if (lang === "my") return (diffStr + " အရင်").toLowerCase()
    return (diffStr + " ago").toLowerCase()
}

function formatTimeDiffStr(diff, lang = "en") {
    lang = lang.toLowerCase()
    if (lang === "ru") return formatTimeRussian(diff)
    if (lang === "zh") return formatTimeChinese(diff)
    if (lang === "hi") return formatTimeHindi(diff)
    if (lang === "es") return formatTimeSpanish(diff)
    if (lang === "fr") return formatTimeFrench(diff)
    if (lang === "ar") return formatTimeArabic(diff)
    if (lang === "bn") return formatTimeBengali(diff)
    if (lang === "pt") return formatTimePortuguese(diff)
    if (lang === "id") return formatTimeIndonesian(diff)
    if (lang === "ur") return formatTimeUrdu(diff)
    if (lang === "de") return formatTimeGerman(diff)
    if (lang === "ja") return formatTimeJapanese(diff)
    if (lang === "sw") return formatTimeSwahili(diff)
    if (lang === "mr") return formatTimeMarathi(diff)
    if (lang === "te") return formatTimeTelugu(diff)
    if (lang === "tr") return formatTimeTurkish(diff)
    if (lang === "ta") return formatTimeTamil(diff)
    if (lang === "vi") return formatTimeVietnamese(diff)
    if (lang === "ko") return formatTimeKorean(diff)
    if (lang === "fa") return formatTimeFarsi(diff)
    if (lang === "it") return formatTimeItalian(diff)
    if (lang === "th") return formatTimeThai(diff)
    if (lang === "gu") return formatTimeGujarati(diff)
    if (lang === "kn") return formatTimeKannada(diff)
    if (lang === "pa") return formatTimePunjabi(diff)
    if (lang === "ms") return formatTimeMalay(diff)
    if (lang === "or") return formatTimeOdia(diff)
    if (lang === "my") return formatTimeBurmese(diff)
    return formatTimeEnglish(diff)
}

function formatTimeEnglish(diff){
    if(diff < 60) return Math.floor(diff) + " " + (Math.floor(diff)===1?"second":"seconds")
    if(diff < 3600) { let m=Math.floor(diff/60); return m + " " + (m===1?"minute":"minutes") }
    if(diff < 86400) { let h=Math.floor(diff/3600); return h + " " + (h===1?"hour":"hours") }
    if(diff < 604800) { let d=Math.floor(diff/86400); return d + " " + (d===1?"day":"days") }
    if(diff < 2592000) { let w=Math.floor(diff/604800); return w + " " + (w===1?"week":"weeks") }
    if(diff < 31536000) { let mo=Math.floor(diff/2592000); return mo + " " + (mo===1?"month":"months") }
    let y=Math.floor(diff/31536000); return y + " " + (y===1?"year":"years")
}

function formatTimeRussian(diff){
    if(diff < 60) return Math.floor(diff) + " " + getRussianWord(Math.floor(diff),"секунду","секунды","секунд")
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " " + getRussianWord(m,"минуту","минуты","минут") }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " " + getRussianWord(h,"час","часа","часов") }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " " + getRussianWord(d,"день","дня","дней") }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " " + getRussianWord(w,"неделю","недели","недель") }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " " + getRussianWord(mo,"месяц","месяца","месяцев") }
    let y=Math.floor(diff/31536000); return y + " " + getRussianWord(y,"год","года","лет")
}

function getRussianWord(number, one, few, many){
    number=Math.abs(number)%100
    let n1=number%10
    if(number>10 && number<20) return many
    if(n1>1 && n1<5) return few
    if(n1===1) return one
    return many
}

function formatTimeChinese(diff){
    if(diff < 60) return Math.floor(diff) + " 秒"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " 分钟" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " 小时" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " 天" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " 周" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " 月" }
    let y=Math.floor(diff/31536000); return y + " 年"
}

function formatTimeHindi(diff){
    if(diff < 60) return Math.floor(diff) + " सेकंड"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " मिनट" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " घंटे" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " दिन" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " सप्ताह" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " महीने" }
    let y=Math.floor(diff/31536000); return y + " साल"
}

function formatTimeSpanish(diff){
    if(diff < 60) return Math.floor(diff) + " segundo" + (Math.floor(diff)===1?"":"s")
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " minuto" + (m===1?"":"s") }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " hora" + (h===1?"":"s") }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " día" + (d===1?"":"s") }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " semana" + (w===1?"":"s") }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " mes" + (mo===1?"":"es") }
    let y=Math.floor(diff/31536000); return y + " año" + (y===1?"":"s")
}

function formatTimeFrench(diff){
    if(diff < 60) return Math.floor(diff) + " seconde" + (Math.floor(diff)===1?"":"s")
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " minute" + (m===1?"":"s") }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " heure" + (h===1?"":"s") }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " jour" + (d===1?"":"s") }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " semaine" + (w===1?"":"s") }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " mois" }
    let y=Math.floor(diff/31536000); return y + " an" + (y===1?"":"s")
}

function formatTimeArabic(diff){
    if(diff < 60) return Math.floor(diff) + " ثانية"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " دقيقة" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " ساعة" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " يوم" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " أسبوع" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " شهر" }
    let y=Math.floor(diff/31536000); return y + " سنة"
}

function formatTimeBengali(diff){
    if(diff < 60) return Math.floor(diff) + " সেকেন্ড"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " মিনিট" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " ঘণ্টা" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " দিন" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " সপ্তাহ" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " মাস" }
    let y=Math.floor(diff/31536000); return y + " বছর"
}
function formatTimePortuguese(diff){
    if(diff < 60) return Math.floor(diff) + " segundo" + (Math.floor(diff)===1?"":"s")
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " minuto" + (m===1?"":"s") }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " hora" + (h===1?"":"s") }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " dia" + (d===1?"":"s") }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " semana" + (w===1?"":"s") }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " mês" + (mo===1?"":"es") }
    let y=Math.floor(diff/31536000); return y + " ano" + (y===1?"":"s")
}

function formatTimeIndonesian(diff){
    if(diff < 60) return Math.floor(diff) + " detik"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " menit" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " jam" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " hari" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " minggu" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " bulan" }
    let y=Math.floor(diff/31536000); return y + " tahun"
}

function formatTimeUrdu(diff){
    if(diff < 60) return Math.floor(diff) + " سیکنڈ"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " منٹ" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " گھنٹہ" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " دن" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " ہفتہ" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " ماہ" }
    let y=Math.floor(diff/31536000); return y + " سال"
}

function formatTimeGerman(diff){
    if(diff < 60) return Math.floor(diff) + " Sekunde" + (Math.floor(diff)===1?"":"n")
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " Minute" + (m===1?"":"n") }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " Stunde" + (h===1?"":"n") }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " Tag" + (d===1?"":"e") }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " Woche" + (w===1?"":"n") }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " Monat" + (mo===1?"":"e") }
    let y=Math.floor(diff/31536000); return y + " Jahr" + (y===1?"":"e")
}

function formatTimeJapanese(diff){
    if(diff < 60) return Math.floor(diff) + " 秒"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " 分" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " 時間" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " 日" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " 週間" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " ヶ月" }
    let y=Math.floor(diff/31536000); return y + " 年"
}

function formatTimeSwahili(diff){
    if(diff < 60) return Math.floor(diff) + " sekunde"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " dakika" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " saa" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " siku" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " wiki" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " mwezi" }
    let y=Math.floor(diff/31536000); return y + " mwaka"
}

function formatTimeMarathi(diff){
    if(diff < 60) return Math.floor(diff) + " सेकंद"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " मिनिटे" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " तास" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " दिवस" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " आठवडे" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " महिने" }
    let y=Math.floor(diff/31536000); return y + " वर्षे"
}

function formatTimeTelugu(diff){
    if(diff < 60) return Math.floor(diff) + " సెకన్లు"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " నిమిషాలు" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " గంటలు" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " రోజులు" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " వారాలు" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " నెలలు" }
    let y=Math.floor(diff/31536000); return y + " సంవత్సరాలు"
}
function formatTimeTurkish(diff){
    if(diff < 60) return Math.floor(diff) + " saniye"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " dakika" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " saat" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " gün" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " hafta" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " ay" }
    let y=Math.floor(diff/31536000); return y + " yıl"
}

function formatTimeTamil(diff){
    if(diff < 60) return Math.floor(diff) + " வினாடிகள்"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " நிமிடங்கள்" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " மணி" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " நாட்கள்" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " வாரங்கள்" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " மாதங்கள்" }
    let y=Math.floor(diff/31536000); return y + " வருடங்கள்"
}

function formatTimeVietnamese(diff){
    if(diff < 60) return Math.floor(diff) + " giây"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " phút" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " giờ" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " ngày" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " tuần" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " tháng" }
    let y=Math.floor(diff/31536000); return y + " năm"
}

function formatTimeKorean(diff){
    if(diff < 60) return Math.floor(diff) + " 초"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " 분" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " 시간" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " 일" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " 주" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " 개월" }
    let y=Math.floor(diff/31536000); return y + " 년"
}

function formatTimeFarsi(diff){
    if(diff < 60) return Math.floor(diff) + " ثانیه"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " دقیقه" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " ساعت" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " روز" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " هفته" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " ماه" }
    let y=Math.floor(diff/31536000); return y + " سال"
}

function formatTimeItalian(diff){
    if(diff < 60) return Math.floor(diff) + " secondo" + (Math.floor(diff)===1?"":"i")
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " minuto" + (m===1?"":"i") }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " ora" + (h===1?"":"e") }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " giorno" + (d===1?"":"i") }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " settimana" + (w===1?"":"e") }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " mese" + (mo===1?"":"i") }
    let y=Math.floor(diff/31536000); return y + " anno" + (y===1?"":"i")
}

function formatTimeThai(diff){
    if(diff < 60) return Math.floor(diff) + " วินาที"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " นาที" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " ชั่วโมง" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " วัน" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " สัปดาห์" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " เดือน" }
    let y=Math.floor(diff/31536000); return y + " ปี"
}

function formatTimeGujarati(diff){
    if(diff < 60) return Math.floor(diff) + " સેકન્ડ"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " મિનિટ" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " કલાક" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " દિવસ" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " અઠવાડિયા" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " મહિનો" }
    let y=Math.floor(diff/31536000); return y + " વર્ષ"
}
function formatTimeKannada(diff){
    if(diff < 60) return Math.floor(diff) + " ಸೆಕೆಂಡ್"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " ನಿಮಿಷ" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " ಗಂಟೆ" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " ದಿನ" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " ವಾರ" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " ತಿಂಗಳು" }
    let y=Math.floor(diff/31536000); return y + " ವರ್ಷ"
}

function formatTimePunjabi(diff){
    if(diff < 60) return Math.floor(diff) + " ਸਕਿੰਟ"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " ਮਿੰਟ" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " ਘੰਟੇ" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " ਦਿਨ" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " ਹਫਤੇ" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " ਮਹੀਨੇ" }
    let y=Math.floor(diff/31536000); return y + " ਸਾਲ"
}

function formatTimeMalay(diff){
    if(diff < 60) return Math.floor(diff) + " saat"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " minit" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " jam" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " hari" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " minggu" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " bulan" }
    let y=Math.floor(diff/31536000); return y + " tahun"
}

function formatTimeOdia(diff){
    if(diff < 60) return Math.floor(diff) + " ସେକେଣ୍ଡ"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " ମିନିଟ୍" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " ଘଣ୍ଟା" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " ଦିନ" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " ସପ୍ତାହ" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " ମାସ" }
    let y=Math.floor(diff/31536000); return y + " ବର୍ଷ"
}

function formatTimeBurmese(diff){
    if(diff < 60) return Math.floor(diff) + " စက္ကန့်"
    if(diff < 3600){ let m=Math.floor(diff/60); return m + " မိနစ်" }
    if(diff < 86400){ let h=Math.floor(diff/3600); return h + " နာရီ" }
    if(diff < 604800){ let d=Math.floor(diff/86400); return d + " ရက်" }
    if(diff < 2592000){ let w=Math.floor(diff/604800); return w + " စတုရန်းပတ်" }
    if(diff < 31536000){ let mo=Math.floor(diff/2592000); return mo + " လ" }
    let y=Math.floor(diff/31536000); return y + " နှစ်"
}
