//Upload Image
console.log("setting")
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


