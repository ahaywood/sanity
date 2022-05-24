import {isArraySchemaType, isObjectSchemaType, isPrimitiveSchemaType} from '@sanity/types'
import {FieldMember} from '../../../store/types/members'
import {
  ArrayOfObjectsFormNode,
  ArrayOfPrimitivesFormNode,
  ObjectFormNode,
} from '../../../store/types/nodes'

export function isMemberObject(member: FieldMember): member is FieldMember<ObjectFormNode> {
  return isObjectSchemaType(member.field.schemaType)
}

export function isMemberArrayOfPrimitives(
  member: FieldMember
): member is FieldMember<ArrayOfPrimitivesFormNode> {
  return (
    isArraySchemaType(member.field.schemaType) &&
    member.field.schemaType.of.every((ofType) => isPrimitiveSchemaType(ofType))
  )
}

export function isMemberArrayOfObjects(
  member: FieldMember
): member is FieldMember<ArrayOfObjectsFormNode> {
  return (
    isArraySchemaType(member.field.schemaType) &&
    member.field.schemaType.of.every((ofType) => isObjectSchemaType(ofType))
  )
}
