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
    async function fetchAllCards() {
      try {
        call().then(res => {
          setResult(
            res.data.data
          );
          setLoading(false);
        })
      } catch (error) {
        setLoading(null);
      }
    }


    fetchAllCards();
    
  }, []);

  return [result, loading];
}

export function useAPuuI(call){
    const [data, setData] = React.useState(null)

    console.log("using api")
  
    call().resolve().then(res => {
      console.log("setting data")
      setData(res.data.data)
    })
  
    return data;
  }

export default apis