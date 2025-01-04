import { objectType, queryField } from 'nexus'

export const CA_ADDRESS = process.env.TESTNET ? '0xa74C7515d81F1448f442cc9519a6db5b146444E5' : '0x20e5172f351d5f0fC84e910c44e4345f1592d03f'
export const abiJson = require('../abi.json')

export default [
    objectType({
        name: 'Contract',
        definition(t) {
            t.string('address')
            t.string('abi')
        }
    }),
    queryField('contract', {
        type: 'Contract',
        async resolve() {
            return {
                address: CA_ADDRESS,
                abi: JSON.stringify(abiJson.abi)
            }
        }
    })
]
