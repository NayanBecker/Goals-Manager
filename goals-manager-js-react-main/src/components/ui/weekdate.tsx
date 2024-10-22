import dayjs from "dayjs";


const fromDate = dayjs().startOf("week").format("D[ de ]MMM");
const toDate = dayjs().endOf("week").format("D[ de ]MMM");

export
    {
        fromDate,
        toDate,
    }
