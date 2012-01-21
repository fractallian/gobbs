class User < ActiveRecord::Base
  has_many :players
  has_many :games, :through => :players

  # does a find or create by facebook id and rescues duplication
  def self.get_user(facebook_id)
    begin
      find_or_create_by_facebook_id(facebook_id)
    rescue ActiveRecord::StatementInvalid => e
      if e.message =~ /Duplicate entry/
        find_by_facebook_id(facebook_id)
      else
        raise e
      end
    end
  end
end
