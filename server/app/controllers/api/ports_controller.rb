# frozen_string_literal: true

module Api
  class PortsController < ApplicationController
    def index # rubocop:disable Metrics/MethodLength
      data = Port.includes(:protocols).order(id: :asc).page(params[:page])
      render json: {
        data: data.map { |port| PortSerializer.new(port).as_json },
        pagination: {
          current_page: data.current_page,
          next_page: data.next_page,
          prev_page: data.prev_page,
          total_pages: data.total_pages,
          total_count: data.total_count
        }
      }, status: :ok
    end
  end
end
