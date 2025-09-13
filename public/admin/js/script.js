
//Button Status
const buttonStatus = document.querySelectorAll('[button-status]');
if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);
    // console.log(url);


    buttonStatus.forEach(button => {
        button.addEventListener('click', () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status)
            }
            else {
                url.searchParams.delete("status");
            }

            console.log(url.href);
            window.location.href = url.href
        })
    })
}
//End Button Status


//Form Search
const formSearch = document.querySelector('#form-search');
if (formSearch) {
    formSearch.addEventListener('submit', (e) => {
        const url = new URL(window.location.href);
        e.preventDefault();
        const keyword = e.target.elements.keyword.value;

        if (keyword) {
            url.searchParams.set("keyword", keyword)
        }
        else {
            url.searchParams.delete("keyword");
        }

        window.location.href = url.href
    })
}
// End Form Search


//Pagination
const buttonPagination = document.querySelectorAll('[button-pagination]');
if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener('click', () => {
            const page = button.getAttribute("button-pagination");
            console.log(page);

            url.searchParams.set("page", page)
            window.location.href = url.href
        })
    })
}
//End Pagination

//Checkbox
const CheckboxMulti = document.querySelector('[checkbox-multi]');
if (CheckboxMulti) {
    const inputCheckAll = CheckboxMulti.querySelector('input[name="checkAll"]');
    const inputIds = CheckboxMulti.querySelectorAll('input[name="id"]');
    inputCheckAll.addEventListener('click', () => {
        if (inputCheckAll.checked) {
            console.log("All checkboxes selected");
            inputIds.forEach(input => input.checked = true)
        }
        else {
            inputIds.forEach(input => input.checked = false)
        }
    })

    inputIds.forEach(input => {
        input.addEventListener('click', () => {
            const countChecked = CheckboxMulti.querySelectorAll("input[name='id']:checked").length;
            if (countChecked === inputIds.length) {
                inputCheckAll.checked = true;
            }
            else {
                inputCheckAll.checked = false;
            }
        })
    })
}
//End Checbox


//Form Change Multi
const formChangeMulti = document.querySelector('[form-change-multi]');
console.log(formChangeMulti)
if (formChangeMulti) {
    formChangeMulti.addEventListener('submit', (e) => {
        e.preventDefault();

        const CheckboxMulti = document.querySelector('[checkbox-multi]');
        const inputsChecked = CheckboxMulti.querySelectorAll("input[name='id']:checked");
        const idsInput = document.querySelector("input[name='ids']");
        // console.log(inputsChecked)

        const typeChange = e.target.elements.type.value;
        console.log(typeChange)

        if (typeChange === "delete-all") {
            const isConfirm = alert("Bạn có chắc chắn muốn xoá các mục đã chọn không?");
            if (!isConfirm) {
                return;
            }
        }

        if (inputsChecked.length > 0) {
            let ids = [];

            inputsChecked.forEach(input => {
                const id = input.getAttribute("value");

                if (typeChange === "change-position") {
                    const postion = input.closest("tr").querySelector("input[name='position']").value;

                    ids.push(`${id}-${postion}`);
                }

                else {
                    ids.push(id);
                }
            })
            idsInput.value = ids.join(", ");
            formChangeMulti.submit();

        } else {
            alert("Vui lòng chọn ít nhất một mục để thay đổi.")
        }

    })
}
//End Form Change Multi


//Delete item
const buttonDelete = document.querySelectorAll('[button-delete]');
if (buttonDelete) {
    const formDeleteItem = document.querySelector('#formDeleteItem');
    const path = formDeleteItem.getAttribute("data-path");
    buttonDelete.forEach(button => button.addEventListener('click', () => {
        const isConfirm = confirm("Bạn có chắc chắn muốn xóa mục này không?");
        if (isConfirm) {
            const id = button.getAttribute("data-id");
            const action = path + `/${id}?_method=DELETE`;
            formDeleteItem.setAttribute("action", action);
            formDeleteItem.submit();
        }


    }))
}
//End Delete Item

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

