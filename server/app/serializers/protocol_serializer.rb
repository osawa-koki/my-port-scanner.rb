# frozen_string_literal: true

class ProtocolSerializer < ActiveModel::Serializer
  attributes :id
  attributes :name
  attributes :description
end
