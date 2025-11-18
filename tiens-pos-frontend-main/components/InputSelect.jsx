import React from 'react';
import Select from 'react-select';

const options = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
];

export default function InputSelect({ onChange, selectedOption }) {
    return (
        <div>
            <label className='text-gray4 mt-2'>Gender</label>

            <Select
                placeholder={'Select Gender'}
                defaultValue={selectedOption}
                onChange={onChange}
                options={options}
            />
        </div>
    );
}
