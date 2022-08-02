import { Prisma } from '@prisma/client'
import axios from 'axios'
import { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react'
import { Button, Container, Form, FormGroup, FormInput, FormSelect, Header, Table } from 'semantic-ui-react'
import pkg from 'semantic-ui-react/package.json'
import prisma from '../lib/prisma'

export async function getServerSideProps() {
  const intialUsers: Prisma.UserUncheckedCreateInput[] = await prisma.user.findMany()
  return {
    props: {
      users: intialUsers
    }
  }
}

interface propsType {
  users: Prisma.UserUncheckedCreateInput[]
}

const options = [
  { key: 'D', text: 'DEVELOPER', value: 'DEVELOPER' },
  { key: 'A', text: 'ADMIN', value: 'ADMIN' },
  { key: 'U', text: 'USER', value: 'USER' },
]

const Home: NextPage<propsType> = ({ users }) => {
  const [user, setUser] = useState<Prisma.UserCreateInput>({
    firstname: '',
    lastname: '',
    email: '',
    avatar: '',
    role: 'DEVELOPER'
  })
  const [intialUsers, setUsers] = useState<Prisma.UserUncheckedCreateInput[]>(users)
  const handleChange = (value, name) => {
    setUser({ ...user, [name]: value })
  }
  return (
    <div>
      <Container style={{
        margin: 20,
        background: 'white',
        padding: 20,
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Header as={"h3"}>
          This app is powered by Next JS, Semantic UI {pkg.version}
        </Header>
        <Form onSubmit={async () => {
          await axios.post('/api/create', { user })
          setUsers([...intialUsers, user])
          setUser({
            firstname: '',
            lastname: '',
            email: '',
            avatar: '',
            role: 'DEVELOPER'
          })

        }}>
          <FormGroup>
            <FormInput label="First Name" placeholder="First Name" value={user.firstname}
              onChange={(e) => {
                handleChange(e.target.value, 'firstname')
              }}
            />
            {/* </FormGroup>
          <FormGroup> */}
            <FormInput label="Last Name" placeholder="Last Name" value={user.lastname}
              onChange={(e) => {
                handleChange(e.target.value, 'lastname')
              }}
            />
            {/* </FormGroup>
          <FormGroup> */}
            <FormInput label="Email" placeholder="Email" value={user.email}
              onChange={(e) => {
                handleChange(e.target.value, 'email')
              }}
            />
            {/* </FormGroup>
          <FormGroup> */}
            <FormInput label="Avatar" placeholder="Avatar" value={user.avatar}
              onChange={(e) => {
                handleChange(e.target.value, 'avatar')
              }}
            />
            {/* </FormGroup>
          <FormGroup> */}
            <Form.Select value={user.role} options={options}
              placeholder={'Role'}
              label={'Role'}
              onChange={(_, { value }) => {
                handleChange(value, 'role')
              }}
            />
          </FormGroup>
          <Button type={'submit'} primary>Submit</Button>

        </Form>
        <Table celled>
          <Table.Header>
            <Table.HeaderCell>Id</Table.HeaderCell>
            <Table.HeaderCell>First Name</Table.HeaderCell>
            <Table.HeaderCell>Last Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Role</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Header>
          <Table.Body>
            {
              users.map((u) => {
                return <Table.Row key={u.id}>
                  <Table.Cell>{u.id}</Table.Cell>
                  <Table.Cell>{u.firstname}</Table.Cell>
                  <Table.Cell>{u.lastname}</Table.Cell>
                  <Table.Cell>{u.email}</Table.Cell>
                  <Table.Cell>{u.role}</Table.Cell>
                  <Table.Cell>
                    <Button type='button' color='red' onClick={async () => {
                      await axios.post('/api/delete', {
                        id: u.id
                      })
                    }}>
                      Delete
                    </Button>
                  </Table.Cell>
                </Table.Row>
              })
            }
          </Table.Body>
        </Table>
      </Container>
    </div >
  )
}

export default Home
