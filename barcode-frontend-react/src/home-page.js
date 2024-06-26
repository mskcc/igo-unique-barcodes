import React, { useState, useEffect } from 'react';
import { getBarcode, getPlateTypes } from './services/barcode';
import { exportCSV } from './util/excel';
import { makeStyles, Button, Paper } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  container: {
    height: 'min-content',
    padding: theme.spacing(4),
    width: '70vw',
    margin: '10em auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '3em',
  },

  quote: { marginBottom: theme.spacing(3) },

  loadingIcon: {
    height: '25px',
    width: '25px',
    animation: '$rotate 2s linear infinite',
    transformOrigin: 'center center',
    marginLeft: '20px',
  },
  
  '@keyframes rotate': {
    '100%': {
      transform: 'rotate(360deg)',
    },
  },
}));

function HomePage() {
  const classes = useStyles();
  const [plateType, setPlateType] = useState('');
  const [numOfBarcodes, setNumOfBarcodes] = useState(0);
  const [errorState, setErrorState] = useState('');
  const [barcodeList, setBarcodeList] = useState({
    barcodeList : [],
  });
  const [plateTypesList, setPlateTypesList] = useState([]);

  useEffect(() => {
    const fetchPlateTypes = async () => {
      const response = await getPlateTypes();
      // console.log(response);
      const list = response.data.data || ['---'];
      setPlateTypesList(list);
    };

    if (plateTypesList.length === 0) {
      fetchPlateTypes().catch(error => console.log(error));
    } else {
      console.log(plateTypesList);
    }
  }, [plateTypesList]);

  const validate = () => {
    if (!numOfBarcodes || isNaN(numOfBarcodes)) {
      setErrorState('Please enter a valid number');
    } else if (numOfBarcodes < 1) {
      setErrorState('Please enter a number greater than zero');
    } else {
      setErrorState('');
    }
  };

  const getPlateBarcode = async () => {
    validate();
    if (errorState === '') {
      const barcodesResponse = await getBarcode(plateType, numOfBarcodes);
      const { data } = barcodesResponse;
      console.log(data);
      setBarcodeList(data);
    }
  };

  const handleExport = () => {
    exportCSV(barcodeList, plateType);
  };

  return (
    <Paper style={{maxHeight: 600, overflow: 'auto'}} className={classes.container}>
      <div className="dropdown">
      <b>Choose Plate Type:</b>
        <select id="plateTypes" onChange={(event) => setPlateType(event.target.value)}>
          <option value=" "> ---Plate type--- </option>
          {plateTypesList.map(type => (
            <option value={type}>{type}</option>
          ))}
        </select>
        <p>Your selected plate type is: <b>{plateType}</b></p>
        <p>Enter the number of barcodes:</p>   
        <input type = "text" id = "count" size = "5" onChange={(event) => setNumOfBarcodes(event.target.value)}></input>
        <p className='error'>{errorState}</p>
    </div>
    <div className={classes.Button}>
      <Button id='generate' onClick={() => getPlateBarcode()} color='primary' variant='contained'> Generate </Button>
      <Button id='gridExport' onClick={handleExport} color='secondary' variant='contained' type='submit'> Export CSV </Button>
    </div>
    {barcodeList && barcodeList.length > 0 ? (
      <table className='barcodeTable'>
      <thead>
        <tr>
          <th>Generated Barcodes</th>
        </tr>
      </thead>
      <tbody>
        { barcodeList.map((barcode) => {
          return (
            <tr key={barcode} className={'barcodeTableRow'}>
              <td className={'barcodeTableData'}>{barcode}</td>
            </tr>
          );
        })
        }
        </tbody>
    </table>
    ) : null
    }
      
    </Paper>
  );
}

export default HomePage;
