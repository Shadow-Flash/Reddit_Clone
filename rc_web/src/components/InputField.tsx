import { FormControl, FormLabel, Input, FormErrorMessage, Textarea } from '@chakra-ui/react';
import { useField } from 'formik';
import React, { InputHTMLAttributes } from 'react';

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {name: string, label: string, textarea?: boolean};

export const InputField: React.FC<InputFieldProps> = ({label,textarea,size:_,...props}) => { 
    let Comp = textarea ? Textarea : Input;
    const [field, {error}] = useField(props);
        return (
            <FormControl isInvalid={!!error}>
                <FormLabel htmlFor={field.name}>{label}</FormLabel>
                <Comp {...field} id={field.name} placeholder={props.placeholder} type={props.type ? props.type : 'text'}/>
                {error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
}