import { MenuItem, Select, TextField, Typography } from '@mui/material';
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import apiClient from '../../../config/api-client';
import { ApiService } from '../../../constants/ApiService';
import useModal from '../../../hooks/use-modal';

type AlumniDetailType = {
    "NIM": string
};

const formatNumber = (input) => {
    const valueString = input.toString().trim();

    if (valueString === '') {
        return '';
    }

    if (/^0+$/.test(valueString)) {
        return '0';
    }

    const cleanedValue = valueString.replace(/^0+/, '').replace(/[\s,.]/g, '');

    const [integerPart, decimalPart] = cleanedValue.split('.');

    const formattedIntegerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return decimalPart ? `${formattedIntegerPart},${decimalPart}` : formattedIntegerPart;
};

const parseNumber = (formattedString) => {
    const valueString = formattedString.trim();

    if (valueString === '') {
        return '';
    }

    const cleanedValue = valueString.replace(/\./g, '');
    return /^0+$/.test(cleanedValue) ? '0' : cleanedValue.replace(/^0+/, '');
};

interface TableRowComponentProps {
    rowName: string;
    index: number;
    formik: any;
    uniqueEngagementCategory: Array<{
      value: string;
      label: string;
    }>;
    uniqueEngagementCategoryDetail: Array<{
        value: string;
        label: string;
        description: string;
    }>;
    uniqueUnit: Array<{
        value: string;
        label: string;
    }>;
  }

const TableRowComponent: React.FC<TableRowComponentProps> = React.memo(({
  rowName,
  index,
  formik,
  uniqueEngagementCategory,
  uniqueEngagementCategoryDetail,
  uniqueUnit
}) => {
    const { showModal } = useModal();

    const textFieldRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(textFieldRef.current){
            textFieldRef.current.value = rowName == 'nominal' ?
            formatNumber(formik.values.items[index][rowName]) :
            ((rowName == 'name' && !formik.values.items[index][rowName]) || 
                (rowName == 'campus' &&  !formik.values.items[index][rowName]) || 
                    (rowName == 'faculty' && !formik.values.items[index][rowName]) ||
                        (rowName == 'program' && !formik.values.items[index][rowName]) ||
                            (rowName == 'degree' && !formik.values.items[index][rowName]))
            ? '-' :formik.values.items[index][rowName];
        }
    }, [formik.values.items, index, rowName]);

    const debounce = useDebouncedCallback((field, value) => {
        formik.setFieldValue(`items[${index}].${field}`, value);
        if(field == 'nim'){
            if((value.length === (value.slice(0,2) == 'BN' ? 9 : 10))){
                fetchAlumniDetails(value);
            }
            else{
                clearDependentFields()
            }
        }
    }, 250);
    
    const textFieldChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      e.persist();
      const { name, value } = e.target;
      if (name == 'nominal' && textFieldRef.current) {
          textFieldRef.current.value = formatNumber(value);
      }
      debounce(name, name == 'nominal' ? parseNumber(value) : value);
    };

    const clearDependentFields = () => {
        setTimeout(async () => {
            const dependentFields = ['name', 'campus', 'faculty', 'program', 'degree'];
    
            await dependentFields.reduce(
                (promiseChain, field) =>
                    promiseChain.then(() =>
                        formik.setFieldValue(`items[${index}].${field}`, "").then(() =>
                            formik.setFieldTouched(`items[${index}].${field}`, true, false)
                        )
                    ),
                Promise.resolve()
            );
    
            formik.validateForm();
        }, 300);
    };

    const fetchAlumniDetails = async (nimValue: string) => {
        setTimeout(async () => {
            try {
                const tempNIM: AlumniDetailType[] = [];
                tempNIM.push({
                    "NIM": nimValue
                });
                const response = await apiClient.post(`${ApiService.engagement}/alumni-detail`, tempNIM);
                if (response.data.length === 0) {
                    showModal({
                        title: 'Failed',
                        message: 'Alumni Not Found',
                        options: { variant: 'failed' },
                    });
                    clearDependentFields();
                } else {
                    const { alumniName, campusName, facultyName, programName, degreeName } = response.data[0];
                    
                    await formik.setFieldValue(`items[${index}].name`, alumniName);
                    await formik.setFieldValue(`items[${index}].campus`, campusName);
                    await formik.setFieldValue(`items[${index}].faculty`, facultyName);
                    await formik.setFieldValue(`items[${index}].program`, programName);
                    await formik.setFieldValue(`items[${index}].degree`, degreeName);
    
                    formik.validateForm();
                }
            } catch (error_) {
                console.error("Error fetching alumni details:", error_);
                clearDependentFields();
            }
        }, 500);
    };

    const error = formik.errors.items?.[index]?.[rowName];
    return(
        ['category','categoryDetail', 'unitName'].includes(rowName) ? (
            <Select
                sx={{ width: '150px', maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                value={formik.values.items[index][rowName]}
                onChange={(event) => {
                    formik.setFieldValue(`items[${index}].${rowName}`, event.target.value);
                }}
                onBlur={formik.handleBlur}
            >
                {(rowName === 'category' ? uniqueEngagementCategory : rowName === 'categoryDetail' ? uniqueEngagementCategoryDetail : uniqueUnit).map((option) => (
                    <MenuItem key={option.value} value={option.label}>
                    <Typography fontSize={14} sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {option.label}
                    </Typography>
                    </MenuItem>
                ))}
            </Select>
        ) : (
            <TextField
                inputRef={textFieldRef}
                name={rowName}
                size="small"
                sx={{ width: '150px', maxWidth: '150px' }}
                onChange={textFieldChangeHandler}
                onBlur={formik.handleBlur}
                disabled={['name', 'campus', 'faculty', 'program', 'degree'].includes(rowName)}
                helperText={error || ''}
            />
        )
    )});
    
    TableRowComponent.propTypes = {
        rowName: PropTypes.string.isRequired,
        index: PropTypes.number.isRequired,
        formik: undefined,
        uniqueEngagementCategory: undefined,
        uniqueEngagementCategoryDetail: undefined,
        uniqueUnit: undefined,
      };

export default TableRowComponent;