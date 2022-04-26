import {useEffect, useState} from 'react'
import {useSelector} from 'react-redux'

/**
 * @type room state type 
 * 'true: connected' || 'false: disconnected'
 */
export default function useRoomState(){
    const state = useSelector(state => state)
    const room = state.signalingSocket
    const [roomState, setRoomState] = useState(room.connected) // if connected true, else false 

    if(!room){
        throw new Error('Client Socket is not connected to Server!')
    }else{
        useEffect(
            ()=>{
                setRoomState(room.connected)
            },[room]
        )
    }
    
    return roomState
}