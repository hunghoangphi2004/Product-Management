console.log("account.js")

const buttonChangeStatus = document.querySelectorAll('[button-change-status]')  
if(buttonChangeStatus.length>0){
    const formChangeStatus = document.querySelector("#formChangeStatus")
    const path = formChangeStatus.getAttribute("data-path")

    buttonChangeStatus.forEach(button=>{
        button.addEventListener('click',()=>{ 
            const currentStatus = button.getAttribute("data-status");
            const id = button.getAttribute("data-id");

            const statusChange = currentStatus === "pending"?"paid":"pending";
            const action = path + `/${statusChange}/${id}?_method=PATCH`;
            formChangeStatus.setAttribute("action", action);
            formChangeStatus.submit()
        })
    })
}

//Upload Image
const uploadImage = document.querySelector('[upload-image]');
if(uploadImage){
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    console.log(uploadImageInput, uploadImagePreview)
    uploadImageInput.addEventListener('change', (e)=>{
        // console.log(e)
        const file = e.target.files[0];
        if(file){
            uploadImagePreview.src = URL.createObjectURL(file);
            console.log(uploadImagePreview.src)
        }
    })
}

//End Upload Image