import React, { useState, useEffect } from 'react'
import { Container, Col, Row, Form, Button, Alert} from 'react-bootstrap';

/*
SearchBar Props:

data: Array of Objects
    An array containing the data to be searched. Each object in the array represents a single item with properties to search.
    Example:
    const data = [
        { name: 'John', date: '2022-01-01' },
        { name: 'Alice', date: '2023-02-15' },
        { name: 'Bob', date: '2022-12-10' },
        // Add more data here...
    ];

searchBy: Array of Strings
    An array specifying the properties of each object to search within. Each string represents a property to be searched.
    Example: ["name", "date"]

onSearch: Function 
    A function defined in the parent component
    Example:
    const handleSearchByName = (filteredData) => {
        // Do something with the filtered data
    };

    <SearchBar
        data={data}
        searchBy={["name", "date"]}
        onSearch={handleSearchByName}
    />
*/

const ApproverSearchBar = ({ data, searchBy , onSearch }) => {
    const [filteredData, setFilteredData] = useState([])
    const [wordEntered, setWordEntered] = useState("")
    const [show, setShow] = useState(false)

    const handleFilter = (e) => {
        try{
            const searchedWord = e.target.value
            setWordEntered(searchedWord)

            const newFilter = data.filter((value) => {
                //return value.name.toLowerCase().includes(searchedWord.toLowerCase())
                
                // Check if the searched word is present in any of the specified properties of the value object
                return searchBy.some((property) =>
                    // Can be read as value.property.toLowerCase().includes(searchedWord)
                    value[property].toLowerCase().includes(searchedWord));            
            })

            if (searchedWord === "") {
                setFilteredData([])
                onSearch(data)  // display original data
            } else {
                setFilteredData(newFilter)
                onSearch(newFilter)   
            }

        } catch (error) {
            console.log(error)
            setShow(true)

        }
    }
    const clearInput = () => {
        setFilteredData([])
        setWordEntered("")
    }

    const dismissAlert = () => {
        setShow(false)
        clearInput()
    }

    useEffect(() => {
        console.log("Filtered Data: ", filteredData)
    }, [filteredData])

    if (show) {
        return (
            <Alert variant="danger" onClose={() => dismissAlert()} dismissible className='mt-3 mx-3' style={{caretColor: "transparent"}}>
                <Alert.Heading>Oh snap!</Alert.Heading>
                <p>
                    The system has malfunctioned and has notified the developers. Please wait a moment :)
                </p>
            </Alert>
        )
    }
        return (
            <Container className='mt-4'>
                <Row>
                    <Col lg={12} className='px-5'>
                        <Form>
                            <Form.Group controlId="filterAccomms"  className='d-flex align-items-center'>
                                <Form.Control 
                                type="search" 
                                placeholder={`Search by ${searchBy.join(" or ")}`}
                                className='m-3' 
                                onChange={handleFilter} 
                                value={wordEntered} />
                                {/* <Button onClick={() => returnResults()} id="searchbtn" className ="rounded-1" variant="secondary">SEARCH</Button> */}
                            </Form.Group>
                        </Form>
                    </Col>
        
                </Row>
              
            </Container>
        )
}

export default ApproverSearchBar