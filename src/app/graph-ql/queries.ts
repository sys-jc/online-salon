import gql from 'graphql-tag';

export const GetQuery1 = gql`
query get_member($gid: String!) {
  tblmember(where: {googleid: {_eq: $gid}}) {
    sei
    mei
    dojoid
    dojoeda
    class
    grade
    mail
  }
}`;

export const UpdateMember = gql`
mutation upd_member($_set: tblmember_set_input = {}) {
  update_tblmember(where: {googleid: {_eq: ""}}, _set: $_set) {
    affected_rows
  }
}`;

export const InsertMember = gql`
mutation ins_member($objects: [tblmember_insert_input!]) {
  insert_tblmember(objects: $objects) {
    affected_rows
  }
}`;