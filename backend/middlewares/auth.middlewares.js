export const checkUser = async (req, res, next) => {
    try {
        if(true) {
            next();
        }
    } catch(error) {
        console.log('Error in auth middleware', error);
    }
}