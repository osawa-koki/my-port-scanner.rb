require 'csv'

file = File.read(Rails.root.join('db', 'data', 'ports.csv'))
CSV.parse(file, headers: true).each do |row|
  id = row['id'].to_i
  tcp = row['protocol'].include?('tcp')
  udp = row['protocol'].include?('udp')
  service = row['service']
  description = row['description']
  severity = row['severity'].to_i
  Port.find_or_create_by!(id:) do |p|
    p.service = service
    p.description = description
    p.severity = severity
    protocol_ids = []
    protocol_ids << Protocol.tcp_id if tcp
    protocol_ids << Protocol.udp_id if udp
    p.protocol_ids = protocol_ids
  end
end

(1..65_535).each do |id|
  Port.find_or_create_by!(id:) do |p|
    p.service = 'unknown'
    p.description = 'unknown'
    p.severity = 3
    p.protocol_ids = []
  end
end
