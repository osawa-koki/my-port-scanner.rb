class PortscanSerializer < ActiveModel::Serializer
  attributes :id
  attributes :host
  attributes :ip_address
  attributes :portscan_results
  attributes :created_at
  attributes :updated_at

  def portscan_results
    object.portscan_results.map { |portscan_result| PortscanResultSerializer.new(portscan_result).as_json }
  end
end
