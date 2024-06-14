const url = "https://api.elevenlabs.io";
const subscription = url + "/v1/user/subscription";


export const getSubscription = async (token) => {
    return await
            fetch(subscription, { headers: { "xi-api-key": token } })
                .then(data => data.json());
}