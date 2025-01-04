import { useState } from 'react'

function App() {
    const [selectedFile, setSelectedFile]: any = useState()
    const changeHandler = (event: any) => {
        setSelectedFile(event.target.files[0])
    }

    const handleSubmission = async file => {
        try {
            const formData = new FormData()
            formData.append('file', file)
            const metadata = JSON.stringify({
                name: 'File name',
            })
            formData.append('pinataMetadata', metadata)

            const options = JSON.stringify({
                cidVersion: 0,
            })
            formData.append('pinataOptions', options)

            const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${import.meta.env.VITE_PINATA_JWT}`,
                },
                body: formData,
            })
            const resData = await res.json()
            console.log(resData)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <label className="form-label"> Choose File</label>
            <input type="file" onChange={changeHandler} />
            <button onClick={() => handleSubmission(selectedFile)}>Submit</button>
        </>
    )
}

export default App
