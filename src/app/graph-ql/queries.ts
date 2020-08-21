import gql from 'graphql-tag';

export const GetQuery1 = gql`
query get_member($gid: String!,$did: String!) {
  tblmember(where: {googleid: {_eq: $gid}, dojoid: {_eq: $did}}) {
    sei
    mei
    memid
    memeda
    class
    birth
    mail
    id
  }
}`;

export const GetQuery2 = gql`
query get_dojo($did: String!) {
  tbldojo_by_pk(dojoid:$did) {
    dojoname
  }
}`;

export const GetQuery3 = gql`
query calc_memid($did: String!) {
  tblmember_aggregate(where: {dojoid: {_eq: $did}}) {
    aggregate {
      max {
        memid
      }
    }
  }
}`;

export const UpdateMember = gql`
mutation upd_member($_set: tblmember_set_input!, $id: Int!) {
  update_tblmember_by_pk(pk_columns: {id: $id}, _set: $_set) {
    id
    googleid
  }
}`;

export const InsertMember = gql`
mutation ins_member($object: tblmember_insert_input!) {
  insert_tblmember_one(object: $object) {
    id
    googleid
  }
}`;