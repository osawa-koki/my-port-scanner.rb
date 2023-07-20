class PortSerializer < ActiveModel::Serializer
  attributes :id
  attributes :port_number
  attributes :service
  attributes :description
  attributes :severity

  attribute :protocols do
    object.protocols.map { |protocol| ProtocolSerializer.new(protocol).as_json }
  end
end
