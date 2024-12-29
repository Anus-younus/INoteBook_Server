export default function sendResponce(res, status, data, error, message) {
    try {
        res.status(status).send({
            data,
            error,
            message
        }) 
    } catch (e) {
        console.log("Internal server error")
    }
}