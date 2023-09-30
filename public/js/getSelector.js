// getSelector.js
const selectors = document.querySelectorAll('.weightSelecter');
let realValues = Array(12).fill("");

selectors.forEach((selector, index) => {
    selector.addEventListener("change", function () {
        realValues[index] = selector.value;

        // ส่งข้อมูล realValues ไปยังเซิร์ฟเวอร์ Express.js
        fetch('/updateRealValues', {
            method: 'POST',
            body: JSON.stringify({ realValues }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            console.log(data); // ตรวจสอบการตอบกลับจากเซิร์ฟเวอร์
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาดในการส่งข้อมูล: ', error);
        });
    });
});
