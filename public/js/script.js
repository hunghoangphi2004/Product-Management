console.log("OK")
//Show alert
const showAlert = document.querySelector('[show-alert]');
console.log('showAlert element:', showAlert);
if (showAlert) {
    const time = parseInt(showAlert.getAttribute("data-time"));
    console.log('Auto hide time:', time);
    setTimeout(() => {
        showAlert.classList.add("alert-hidden")
    }, time)

    const closeAlert = showAlert.querySelector('[close-alert]');
    console.log('closeAlert button:', closeAlert);
    if (closeAlert) {
        console.log('Adding click listener to close button');
        closeAlert.addEventListener('click', () => {
            console.log('Close button clicked');
            showAlert.classList.add("alert-hidden")
        })
    } else {
        console.log('Close alert button not found'); // Debug 6
    }
}
//End Show alert
