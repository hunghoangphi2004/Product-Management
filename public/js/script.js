
//Show alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)

    const closeAlert = showAlert.querySelector('[close-alert]');
    if (closeAlert) {
        closeAlert.addEventListener('click', () => {
            showAlert.classList.add("alert-hidden")
        })
    } else {
        console.log('Close alert button not found'); // Debug 6
    }
}
//End Show alert
