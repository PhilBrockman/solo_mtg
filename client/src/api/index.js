import axios from 'axios'
import React from 'react'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const insertPlayingCard = payload => api.post(`/playingCard`, payload)
export const getAllPlayingCards = () => api.get(`/playingCards`)
export const updatePlayingCardById = (id, payload) => api.put(`/playingCard/${id}`, payload)
export const deletePlayingCardById = id => api.delete(`/playingCard/${id}`)
export const getPlayingCardById = id => api.get(`/playingCard/${id}`)

const apis = {
    insertPlayingCard,
    getAllPlayingCards,
    updatePlayingCardById,
    deletePlayingCardById,
    getPlayingCardById,
}

export function useAPI(call) {
  const [result, setResult] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function callAsynch() {
      try {
        call([...arguments].splice(1)).then(res => {
          setResult(
            res.data.data
          );
          setLoading(false);
        })
      } catch (error) {
        console.error("something went wrong", error)
        setLoading(null);
      }
    }

    callAsynch();    
  }, [call]);

  return [result, loading];
}

export default apis