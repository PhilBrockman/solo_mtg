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

export function useAPI(call){
    const [data, setData] = React.useState(null)
  
    call().then(res => {
      setData(res.data.data)
    })
  
    return data;
  }

export default apis