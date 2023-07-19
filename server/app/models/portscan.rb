# frozen_string_literal: true

require 'socket'
require 'timeout'

class Portscan < ApplicationRecord
  after_initialize :set_ip_address
  after_validation :validate_port_range

  validates :host, presence: true
  validates :port_start, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 65_535 }
  validates :port_end, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 65_535 }
  validates :timeout_second, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 10 }
  validates :thread_count, presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 1, less_than_or_equal_to: 100 }

  def start_scanning # rubocop:disable Metrics/MethodLength, Metrics/AbcSize
    puts "start scanning: #{host}."
    # Mutexオブジェクトを作成。
    mutex = Mutex.new
    # スレッドを使用してポートスキャンを実行し、結果をハッシュに追加。
    results = []
    threads = []
    i = port_start
    (1..thread_count).each do
      threads << Thread.new do
        loop do
          port_number = nil
          mutex.synchronize do
            port_number = i
            i += 1
          end
          break if port_number > port_end

          port_result = port_open?(port_number)
          mutex.synchronize do
            results << port_result
          end
        end
      rescue ThreadError
        puts "ThreadError: #{port_number}(#{host})."
      end
    end
    threads.each(&:join)
    results
  end

  private

  def validate_port_range
    errors.add(:port_start, 'is greater than port_end.') if port_start > port_end
  end

  def set_ip_address
    update!(ip_address: IPSocket.getaddress(host))
  end

  def port_open?(port_number)
    Timeout.timeout(timeout_second) do
      s = TCPSocket.new(host, port_number)
      s.close
    end
    { port_number:, open: true }
  rescue Timeout::Error, Errno::ETIMEDOUT
    { port_number:, open: false }
  end
end
