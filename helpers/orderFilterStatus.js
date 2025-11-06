module.exports = (query) => {
    filterStatus = [
        {
            name: "Tất cả",
            status: "",
            class: ""
        },
        {
            name: "Đã thanh toán",
            status: "paid",
            class: ""
        },
        {
            name: "Chưa thanh toán",
            status: "pending",
            class: ""
        }
    ]

    if (query.status) {
        const index = filterStatus.findIndex(item => item.status == query.status);
        filterStatus[index].class = "active";
    } else {
        const index = filterStatus.findIndex(item => item.status == "");
        filterStatus[index].class = "active";
    }

    return filterStatus;
}