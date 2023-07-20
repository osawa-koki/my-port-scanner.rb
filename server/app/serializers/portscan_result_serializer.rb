class PortscanResultSerializer < ActiveModel::Serializer
  attributes :id
  attributes :port_number
  attributes :open
  attributes :created_at
  attributes :updated_at
  attributes :port

  def port_number
    object.port_id
  end

  def port
    PortSerializer.new(object.port).as_json
  end
end
