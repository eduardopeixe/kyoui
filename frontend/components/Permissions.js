import { Query, Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from './ErrorMessage';
import Table from './styles/Table';
import KyouiButton from './styles/KyouiButton';
import PropTypes from 'prop-types';

const possiblePermissions = [
  'ADMIN',
  'USER',
  'ITEMCREATE',
  'ITEMUPDATE',
  'ITEMDELETE',
  'PERMISSIONUPDATE'
];

const UPDATE_PERMISSIONS_MUTATION = gql`
  mutation updatePermissions($permissions: [Permission], $userId: ID!) {
    updatePermissions(permissions: $permissions, userId: $userId) {
      id
      permissions
      name
      email
    }
  }
`;
const ALL_USERS_QUERY = gql`
  query {
    users {
      id
      name
      email
      permissions
    }
  }
`;
const Permissions = props => (
  <Query query={ALL_USERS_QUERY}>
    {({ data, loading, error }) => (
      <div>
        <Error error={error} />
        <div>
          <h2>Manage Permissions</h2>
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                {possiblePermissions.map(p => (
                  <th key={p}>{p}</th>
                ))}
                <th>userUpdate</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(user => (
                <UserPermissions user={user} key={user.id} />
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    )}
  </Query>
);

class UserPermissions extends React.Component {
  static propTypes = {
    user: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
      id: PropTypes.string,
      permissions: PropTypes.array
    }).isRequired
  };

  //bad practice - dont use props to populate state
  //it would not be updated the state
  //having the data changing in 2 spots
  state = {
    permissions: this.props.user.permissions
  };

  handlePermissionChange = (e, updatePermissions) => {
    const checkbox = e.target;
    //take a copy of current permissions
    let updatedPermissions = [...this.state.permissions];
    //remove or add the permission
    checkbox.checked
      ? updatedPermissions.push(checkbox.value)
      : (updatedPermissions = updatedPermissions.filter(p => checkbox.value));
    this.setState({ permissions: updatedPermissions }, updatePermissions);
  };
  render() {
    const user = this.props.user;
    return (
      <Mutation
        mutation={UPDATE_PERMISSIONS_MUTATION}
        variables={{
          permissions: this.state.permissions,
          userId: this.props.user.id
        }}
      >
        {(updatePermissions, { loading, error }) => (
          <>
            {error && (
              <tr>
                <td colSpan="8">
                  <Error error={error} />
                </td>
              </tr>
            )}
            <tr>
              <td>{user.name}</td>
              <td>{user.email}</td>
              {possiblePermissions.map(permission => (
                <td key={permission}>
                  <label htmlFor={`$${user.id}-permission-${permission}`}>
                    <input
                      id={`$${user.id}-permission-${permission}`}
                      type="checkbox"
                      checked={this.state.permissions.includes(permission)}
                      value={permission}
                      onChange={e =>
                        this.handlePermissionChange(e, updatePermissions)
                      }
                    />
                  </label>
                </td>
              ))}
              <td>
                <KyouiButton
                  type="button"
                  disabled={loading}
                  onClick={updatePermissions}
                >
                  Updat{loading ? 'ing' : 'e'}
                </KyouiButton>
              </td>
            </tr>
          </>
        )}
      </Mutation>
    );
  }
}
export default Permissions;
