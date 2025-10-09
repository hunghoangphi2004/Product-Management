//Change Status
const buttonChangeStatus = document.querySelectorAll('[button-change-status]');
if(buttonChangeStatus.length > 0) {
    const formChangeStatus = document.querySelector('#formChangeStatus');
    const path = formChangeStatus.getAttribute("data-path");


    buttonChangeStatus.forEach(button => {
        button.addEventListener('click', () => {
            const statusCurrent = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            let statusChange = statusCurrent === "active" ? "inactive": "active"
            // console.log(statusCurrent);
            // console.log(id);
            // console.log(statusChange);

            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.setAttribute("action", action);
            formChangeStatus.submit();
        })
    })
}
//End Change Status

//Upload Image
const uploadImage = document.querySelector('[upload-image]');
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    console.log(uploadImageInput, uploadImagePreview)
    uploadImageInput.addEventListener('change', (e)=>{
        console.log(e)
        const file = e.target.files[0];
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
            console.log(uploadImagePreview.src)
        }
    })
}

//End Upload Image


