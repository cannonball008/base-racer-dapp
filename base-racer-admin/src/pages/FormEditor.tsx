import { Button, Input, Select, SelectItem, Spinner } from '@nextui-org/react'
import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { proxy, ref, useSnapshot } from 'valtio'
import { getContestants, getContract } from '../abi-src'
import { pickObj } from '@zardoy/utils'
import DisplayImage from '../DisplayImage'

interface HandledInputData {
    options?: { value: string | number; label: string }[]
    selected?: (string | number)[]
    defaultValue?: any
}

const pagesConfig = {
    race: {
        fields: [
            {
                key: 'name',
                required: true,
            },
            {
                key: 'laps',
                type: 'number',
                required: true,
            },
            {
                key: 'minBet',
                type: 'number',
                label: 'Minimum Bet Limit',
                getData(_, editingId): HandledInputData {
                    return {
                        defaultValue: editingId !== undefined ? formatEth(formData.value.minBet) : '',
                    }
                },
                required: true,
            },
            {
                key: 'maxBet',
                type: 'number',
                label: 'Maximum Bet Limit',
                getData(_, editingId): HandledInputData {
                    return {
                        defaultValue: editingId !== undefined ? formatEth(formData.value.maxBet) : '',
                    }
                },
                required: true,
            },
            {
                key: 'contestants',
                type: 'select',
                required: true,
                async getData(contract, editingId): Promise<HandledInputData> {
                    const contestants = await getContestants(contract)
                    const selectedContestants =
                        editingId !== undefined
                            ? (await Promise.all(contestants.map(x => contract.raceContestants(editingId, x.id))))
                                  .map((x, i) => {
                                      return x ? contestants[i]?.id : undefined
                                  })
                                  .filter(Boolean)
                            : []
                    return {
                        options: contestants.map(x => ({ value: Number(x.id), label: x.name })),
                        selected: selectedContestants,
                        defaultValue: selectedContestants,
                    }
                },
            },
            {
                key: 'startingTimestamp',
                label: 'Starting Time',
                type: 'datetime-local',
                required: true,
                getData(_, editingId): HandledInputData {
                    if (typeof formData.value.startingTimestamp !== 'number') return {} // todo
                    return {
                        defaultValue: editingId !== undefined ? new Date(formData.value.startingTimestamp * 1000).toISOString().split('.')[0] : '',
                    }
                },
                onChange(e) {
                    formData.value.startingTimestamp = new Date(e.target.value).valueOf()
                },
                labelPlacement: 'outside-left',
            },
        ],
    },
    contestant: {
        fields: [
            {
                key: 'name',
                required: true,
            },
            {
                key: 'description',
            },
            {
                key: 'filePic',
                type: 'file',
                accept: 'image/*',
                // label outside left
                labelPlacement: 'outside-left',
                label: 'Change Picture',
                PreRender() {
                    return <div className="flex items-center">{formData.value.pic ? <DisplayImage cid={formData.value.pic} /> : 'No current picture'}</div>
                },
                PostRender(initialData) {
                    let button
                    const {
                        value: { pic, filePic },
                    } = useSnapshot(formData)
                    if ((filePic && pic) || (initialData.pic && !pic)) {
                        button = (
                            <Button
                                onClick={() => {
                                    formData.value.filePic = ''
                                    formData.value.pic = initialData.pic
                                }}
                            >
                                Restore Picture
                            </Button>
                        )
                    }
                    if (filePic || pic) {
                        button = (
                            <Button
                                onClick={() => {
                                    formData.value.filePic = ''
                                    formData.value.pic = ''
                                }}
                            >
                                Remove Picture
                            </Button>
                        )
                    }
                    return (
                        <>
                            {button}
                            {filePic && <img src={URL.createObjectURL(filePic)} width={100} style={{ height: 100 }} />}
                        </>
                    )
                },
                defaultValue: '',
                classNames: {
                    input: 'h-auto',
                },
                onChange(e) {
                    formData.value.filePic = ref(e.target.files[0])
                },
            },
        ],
    },
}

const formData = proxy({
    value: {} as Record<string, any>,
})

const handleSubmission = async (file: File) => {
    try {
        const formData = new FormData()
        if (file.size > 1024 * 1024) throw new Error('File size must be less than 1MB')
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
        return resData.IpfsHash
    } finally {
    }
}

const handleRemove = cid => {
    // todo
}

const formatWei = x => String(BigInt(x) * 10n ** 18n) as any
const formatEth = x => x / 10 ** 18

export default () => {
    const upperFirst = (str: string) => str[0]!.toUpperCase() + str.slice(1)
    const navigate = useNavigate()

    const location = useLocation()
    const entity = location.pathname.split('/')[1]!
    const entityTitle = upperFirst(entity)
    const config = pagesConfig[entity]
    const _editingId = useParams().id! ?? undefined
    const editingId = isNaN(+_editingId) ? _editingId : +_editingId
    const isEditAction = typeof editingId === 'number'

    const [loaded, setLoaded] = useState(!isEditAction)
    const [inputData, setInputData] = useState({} as Record<string, any>)
    const initialEditingData = useRef({} as Record<string, any>)
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        ;(async () => {
            formData.value = {}
            const o = {}
            const contract = await getContract()
            if (isEditAction) {
                if (entity === 'race') {
                    formData.value = await contract.races(editingId)
                } else {
                    formData.value = await contract.contestants(editingId)
                }
                initialEditingData.current = { ...formData.value }
            }
            for (const field of config.fields) {
                const data: HandledInputData | undefined = await field.getData?.(contract, editingId)
                if (data?.defaultValue !== undefined) {
                    formData.value[field.key] = data.defaultValue // override custom data
                }
                Object.assign(o, { [field.key]: data })
            }
            setInputData(o)
            if (isEditAction) {
                setLoaded(true)
            }
        })()
    }, [])

    const submitAction = async e => {
        e.preventDefault()
        setAdding(true)
        try {
            const contract = await getContract()
            let hasGeneralChanged = isEditAction && Object.entries(formData.value).some(([key, value]) => value !== initialEditingData.current[key])

            let tx
            if (entity === 'race') {
                hasGeneralChanged = true // TODO!
                const allContestantIds = inputData.contestants.options.map(x => x.value)
                const selectedContestantIds = [...formData.value.contestants].filter(x => x !== undefined).map(x => Number(x))

                const startingTimestamp = new Date(formData.value.startingTimestamp).valueOf() / 1000
                if (isNaN(startingTimestamp)) throw new Error('Invalid date')
                if (startingTimestamp < Date.now() / 1000) throw new Error('Starting time must be in the future')
                let raceId
                if (isEditAction) {
                    raceId = editingId
                } else {
                    await contract.createRaceWithContestants(
                        formData.value.name,
                        formData.value.laps,
                        formatWei(formData.value.minBet),
                        formatWei(formData.value.maxBet),
                        startingTimestamp,
                        selectedContestantIds,
                    )
                    raceId = await contract.currentContestantId()
                }

                console.log('oldContestants', initialEditingData.current.contestants)
                await Promise.all([
                    isEditAction && hasGeneralChanged
                        ? contract.updateRaceWithContestants(
                              editingId,
                              formData.value.name,
                              formData.value.laps,
                              formatWei(formData.value.minBet),
                              formatWei(formData.value.maxBet),
                              startingTimestamp,
                              allContestantIds.filter(x => !selectedContestantIds.includes(x)), // todo
                              selectedContestantIds,
                          )
                        : Promise.resolve(),
                ])
            }
            if (entity === 'contestant') {
                const isPicChanged = formData.value.pic !== initialEditingData.current.pic || formData.value.filePic
                let pic = formData.value.pic ?? ''
                if (isPicChanged) {
                    await handleRemove(initialEditingData.current.pic)
                    if (formData.value.filePic) {
                        const id = await handleSubmission(formData.value.filePic)
                        pic = `https://${import.meta.env.VITE_GATEWAY_URL}/ipfs/${id}`
                    }
                }

                if (isEditAction) {
                    if (hasGeneralChanged) {
                        tx = await contract.updateContestant(editingId, formData.value.name, formData.value.description ?? '', pic)
                    } else {
                        throw new Error('No changes detected')
                    }
                } else {
                    tx = await contract.addContestant(formData.value.name, formData.value.description ?? '', pic)
                }
            }
            navigate(entity === 'race' ? '/' : `/${entity}s`)
        } finally {
            setAdding(false)
        }
    }

    // const {value: dataSnapshot} = useSnapshot(entityData)

    return (
        <form className="flex w-full flex-wrap gap-4 relative" onSubmit={submitAction}>
            <div
                className={`absolute inset-0 flex justify-center items-center z-10 bg-black bg-opacity-15 rounded-xlu transition ${
                    loaded && !adding && 'opacity-0 pointer-events-none'
                }`}
            >
                <Spinner label="Loading..." className="mt-[43px]" />
            </div>
            <h1 className="text-xl font-bold">
                {isEditAction ? 'Edit' : 'New'} {entity}
            </h1>
            {config.fields.map(field => {
                const { key, label, getData, PreRender, PostRender, ...props } = field
                const resolvedDefaultValue = inputData[field.key]?.defaultValue
                if (resolvedDefaultValue !== undefined) {
                    props.defaultValue = resolvedDefaultValue
                }

                if (props.required) props.isRequired = true
                // loaded added to key to force re-render with fresh loaded data (default-props)
                const elemKey = loaded + field.key
                if (field.type === 'select') {
                    const multiSelect = Array.isArray(inputData[field.key]?.selected)
                    const defaultSelected = multiSelect ? inputData[field.key].selected : [inputData[field.key]?.selected]
                    return (
                        <Select
                            onClick={e => {
                                e.preventDefault() // bug form submits on select click
                            }}
                            key={elemKey}
                            selectionMode="multiple"
                            label={field.label ?? upperFirst(field.key)}
                            {...props}
                            defaultSelectedKeys={defaultSelected.map(x => x?.toString())}
                            onSelectionChange={keys => {
                                formData.value[field.key] = multiSelect ? keys : keys[0]
                            }}
                        >
                            {inputData[field.key]?.options?.map(option => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label ?? upperFirst(option.value)}
                                </SelectItem>
                            ))}
                        </Select>
                    )
                }
                const Component = field.type === 'file' ? 'input' : Input
                return (
                    <div className="w-full">
                        {PreRender && <PreRender />}
                        <Component
                            key={elemKey}
                            label={field.label ?? upperFirst(field.key)}
                            // be careful of using it only once
                            defaultValue={formData.value[field.key] ?? ''}
                            onChange={e => {
                                formData.value[field.key] = e.target.value
                            }}
                            {...props}
                        />
                        {PostRender && <PostRender />}
                    </div>
                )
            })}
            <Button type="submit">
                {isEditAction ? 'Edit' : 'Create'} {entityTitle}
            </Button>
        </form>
    )
}
