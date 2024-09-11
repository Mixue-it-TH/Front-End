function convertUtils(timeUTC) {
    const formattedTimeZone = formatTimeZone(timeUTC)
    const [date, timeString] = formattedTimeZone.split(",")
    return `${date} ${timeString}`
}

function formatTimeZone(timestampString) {
    const timestamp = new Date(timestampString)
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    const formattedtimestamp = timestamp.toLocaleString("en-GB", {
        timeZone: userTimeZone,
    })
    return formattedtimestamp   
}
function convertStatus(statusString) {
    const words = statusString.split('_');
    return words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

export { convertUtils, formatTimeZone, convertStatus }