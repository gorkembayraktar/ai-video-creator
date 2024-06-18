const url = "https://api.stability.ai";
const subscription = url + "/v1/user/balance";


export const getBalance = async (token) => {
    return await
            fetch(subscription, { headers: { "Authorization": `Bearer ${token}` } })
                .then(data => data.json());
}